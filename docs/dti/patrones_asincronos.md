# Identificación de Flujos Asíncronos (Saga, Outbox, CQRS) en SimonCloud

Basado en la lectura de *Microservices Patterns* (Richardson): Cap. 3 §3.3 (Transactional Outbox, p.97), Cap. 4 §4.1.3 y §4.2.2 (Saga Orquestada, p.114/121), y Cap. 7 §7.2 (CQRS, p.228), se han identificado tres flujos candidatos en SimonCloud donde estos patrones asíncronos resuelven problemas concretos de consistencia y disponibilidad.

---

## 1. Patrón SAGA
**Candidato:** Flujo de *Upgrade de Cuota por QR* (FSD-UC-003)

- **Contexto:** Cuando un estudiante solicita incrementar su almacenamiento al plan Pro (50GB), el sistema debe interactuar con una pasarela de pagos externa (QR Simple), actualizar el almacenamiento del usuario y enviar una factura por correo.
- **Problema que resuelve:** Una transacción distribuida tradicional (2PC) bloquearía los servicios y no es viable con APIs externas como QR Simple.
- **Tipo elegido: Saga Orquestada** (Richardson §4.2.2). Se elige orquestación sobre coreografía porque el flujo tiene múltiples pasos con compensación explícita y es necesario rastrear el estado global de la saga desde un único lugar. Con coreografía, detectar que "el QR expiró y hay que compensar" requeriría que cada servicio conozca el estado de los demás, aumentando el acoplamiento.
- **Estructura de la Saga (Richardson §4.1.3 y §4.3):**
  - **Transacción Compensable (Compensatable transaction):** El paso 1 (`quota-service` reservando el upgrade en `PENDING`). Si la saga falla después, esta transacción puede revertirse con una transacción compensatoria.
  - **Transacción Pivote (Pivot transaction):** El paso 2 (`quota-service` validando el pago vía webhook de QR Simple Bolivia). Si la transacción pivote se completa con éxito, la saga continuará hasta el final de forma irrevocable. Si falla, se ejecutan las compensaciones de los pasos anteriores.
  - **Transacciones Retornables/Reintentables (Retriable transactions):** Los pasos 3 y 4 (`UpgradeQuota` y `SendConfirmationEmail`). Son transacciones que siguen a la transacción pivote y de las cuales se garantiza que eventualmente tendrán éxito (si fallan temporalmente, se reintentan hasta que completen).
- **Implementación:**
  1. El orquestador de la Saga (en `quota-service`) inicia creando la solicitud en estado `PENDING` (**Transacción Compensable**).
  2. Llama directamente a la API de QR Simple Bolivia (adaptador dentro del `quota-service`) para generar el QR y espera el Webhook asíncrono.
  3. Al recibir el Webhook `payment.confirmed` (validado por firma HMAC con `crypto.timingSafeEqual`), el adaptador de webhook del `quota-service` notifica al orquestador con `PaymentCompleted` (**Transacción Pivote**).
  4. El orquestador envía el comando `UpgradeQuota` al `quota-service`, que actualiza `quota_limit_mb = 51200` (**Transacción Reintentable**).
  5. El orquestador envía el comando `SendConfirmationEmail` al `notification-service` (**Transacción Reintentable**).
  6. **Transacciones compensatorias:** Si el QR expira o el Webhook llega con HMAC inválido antes del pivote, el orquestador ejecuta la transacción compensatoria en `quota-service` cancelando el upgrade (`CancelUpgradeRequest`).

---

## 2. Patrón Transactional OUTBOX
**Candidato:** Flujo de *Subida de Archivo y Notificación al Docente* (FSD-UC-002 / FSD-UC-007)

- **Contexto:** Cuando un estudiante sube exitosamente su tarea a un buzón (SimonDrop), el sistema debe guardar el registro en la base de datos y emitir un evento para que el docente sea notificado.
- **Problema que resuelve:** Si el `file-service` guarda el archivo en PostgreSQL pero luego falla al intentar publicar el mensaje en el Message Broker (ej. RabbitMQ/Redis está caído), el sistema queda en un estado inconsistente y el docente nunca es notificado (Problema de la escritura dual).
- **Implementación:**
  1. El `file-service` guarda los metadatos del archivo en la tabla `files`.
  2. En la **misma transacción local de PostgreSQL**, inserta el evento `FileUploadedEvent` en una tabla llamada `outbox`.
  3. Se realiza el `COMMIT` de la base de datos garantizando atomicidad.
  4. Un proceso asíncrono (Message Relay, como Debezium leyendo el log de transacciones o un Polling Publisher) lee la tabla `outbox` y publica el mensaje en el Broker, garantizando entrega *at-least-once* al `notification-service`.

---

## 3. Patrón CQRS (Command Query Responsibility Segregation)
**Candidato:** Flujo de *Panel de Administrador y Métricas Globales* (FSD-UC-010)

- **Contexto:** El FSD-UC-010 describe que el panel "calcula en tiempo real" métricas globales (almacenamiento, usuarios activos, actas). En la implementación síncrona actual, esto implicaría hacer *joins* costosos o múltiples llamadas HTTP a `file-service`, `auth-service`, `simondrop-service` y `quota-service` en cada carga del panel.
- **Problema que resuelve (Richardson §7.2):** API Composition síncrona crea acoplamiento temporal, reduce disponibilidad (si un servicio falla, el panel completo falla) y escala mal ante alta concurrencia de administradores. CQRS materializa el resultado de esas queries en un *Read Model* dedicado, actualizado asíncronamente.
- **Propuesta de mejora con CQRS:**
  1. **Separación C/Q:** Las escrituras (Commands) siguen ocurriendo en cada microservicio individual (cada uno con su propia BD). Las lecturas de métricas se dirigen al nuevo Read Model.
  2. **Read Model:** El `admin-service` mantiene una tabla materializada `dashboard_metrics` (en PostgreSQL) optimizada para las consultas del panel: un registro por tenant con contadores desnormalizados.
  3. **Actualización Asíncrona:** El `admin-service` se suscribe al Message Broker y reacciona a los eventos de dominio: `FileUploaded` → incrementa contador de almacenamiento; `QuotaUpgraded` → incrementa upgrades de cuota; `UserRegistered` → incrementa usuarios activos.
  4. **Query Eficiente:** `GET /admin/metrics` lee directamente `dashboard_metrics` en O(1) — sin impactar a los servicios transaccionales y sin acoplamiento temporal.
  5. **Trade-off aceptado:** Las métricas son *eventualmente consistentes* (pueden tener latencia de segundos). Dado que el panel de administrador no requiere precisión de milisegundos, este trade-off es apropiado (Richardson §7.2: "CQRS is well-suited for queries that join data from multiple services").
