# Skill: simoncloud-saga

## Role
Diseñas la saga de un flujo crítico de SimonCloud en Mermaid (`stateDiagram-v2`) y produces el ADR de orquestación vs coreografía. Aplicas compensaciones idempotentes y siempre exitosas, timeouts, Wait for Task Token y Correlation ID.

## Activation context
Activar cuando: el catálogo de eventos ya existe y el flujo cruza ≥ 2 bounded contexts de SimonCloud. NO activar si el catálogo de eventos no existe (correr antes `/project:event-catalog`).

## Context / Inputs requeridos
- Nombre y descripción del flujo crítico (ej. "Entrega de tarea por estudiante vía SimonDrop").
- Lista ordenada de pasos del happy path (mínimo 4).
- Bounded contexts de SimonCloud involucrados (Auth, SimonDrop, Expedientes, Notificaciones, Pagos).
- `docs/events/catalog.md` (catálogo existente).
- `AGENTS.md` — broker: RabbitMQ sobre Docker Swarm on-premise.

## Reasoning (pasos en orden)

1. **Verificar inputs**: si el flujo no cruza ≥ 2 bounded contexts, STOP (es un UC simple).
2. **Modelar happy path** como secuencia de pasos con evento principal y bounded context.
3. **Asignar compensación por paso**:
   - Idempotente (puede ejecutarse 2+ veces con igual resultado).
   - Siempre exitosa o con `manual-operator-alert` documentado.
   - Reversibilidad explícita: un email enviado no se "des-envía" — mitigar con `NotificacionCorreccionEvent`.
4. **Declarar timeouts por paso** con valores concretos en segundos (no "razonable").
5. **Identificar pasos Wait for Task Token**: aprobación docente, confirmación pago QR (webhook), validación administrativa.
6. **Definir Correlation ID**: `tramiteId:UUID` o `dropId:UUID` propagado en cada evento.
7. **Decidir choreography vs orchestration** comparando ≥ 3 dimensiones:
   - Acoplamiento entre servicios.
   - Visibilidad del workflow para debugging.
   - Modificabilidad sin redeploy de múltiples servicios.
   - Tooling disponible en Docker Swarm (sin Step Functions — on-premise).
8. **Producir diagrama** Mermaid `stateDiagram-v2` con happy path + compensaciones + timeouts.
9. **Producir ADR** completo: contexto, ≥ 3 opciones evaluadas, decisión, consecuencias positivas y negativas.

## Stop condition
Detente cuando: compensaciones idempotentes y siempre exitosas, cada paso con timeout, ≥ 1 Wait for Task Token si hay humanos, ADR con ≥ 3 opciones contra ≥ 3 dimensiones.

## Output esperado

- `docs/diagrams/saga_<flujo>.mmd` — `stateDiagram-v2`:
  - Estados nominales del happy path.
  - Transiciones etiquetadas con evento + timeout (ej. `ArchivoSubido [t=30s]`).
  - Estados de compensación: `CancelarDrop`, `RevocarTokenExterno`, `RevertirPago`.
  - Notas inline para Wait for Task Token.

- `docs/adr/00NN-orquestacion-vs-coreografia.md`:
  - ≥ 3 opciones: choreography pura, orchestration direct-call, orchestration event-driven.
  - Cada opción contra ≥ 3 dimensiones del contexto SimonCloud (on-premise Docker Swarm).
  - Consecuencias positivas y negativas explícitas.

- Tabla de compensaciones:

| Paso | Evento happy path | Bounded context | Compensación | Idempotente | Siempre exitosa | Reversible | Timeout |
|------|-------------------|-----------------|-------------|-------------|-----------------|------------|---------|
| Crear Drop | DropCreadoEvent | SimonDrop | CancelarDrop | sí | sí | sí | 5 s |
| Subir archivo | ArchivoSubidoEvent | SimonDrop | EliminarArchivoMinIO | sí | sí | sí | 30 s |
| Generar token externo | TokenExternoGeneradoEvent | SimonDrop | RevocarToken | sí | sí | sí | 5 s |
| Notificar docente | DocenteNotificadoEvent | Notificaciones | (mitigar con NotificacionCorreccion) | sí | sí | no (email enviado) | 10 s |
| Aprobar recepción | RecepcionAprobadaEvent (docente) | SimonDrop | (Wait for Task Token — humano) | sí | sí | no aplica | 604800 s (7 días) |

## Invariantes
- MUST NOT: Mermaid con `style`, `classDef` ni caracteres conflictivos — el diagrama debe renderizar en GitHub.
- MUST: Correlation ID propagado en cada evento de la saga.
- MUST: Compensaciones idempotentes sin excepción (o plan de `manual-operator-alert` documentado).
- MUST: Outbox Pattern para todos los eventos emitidos en la saga (Prisma `$transaction` + `outbox_events`).
- MUST NOT: Saga con > 7 pasos sin revisar la descomposición de bounded contexts.

## Anti-patrones específicos SimonCloud
- **Saga sin Correlation ID**: imposible rastrear en producción con 7 microservicios. Mitigación: `tramiteId:UUID` en cada evento.
- **Compensación de email enviado que intenta "des-enviar"**: imposible. Mitigación: `NotificacionCorreccionEvent` explícita.
- **Orchestrator central que llama REST sync a todos los servicios**: acoplamiento + cascade failure. Mitigación: orchestration event-driven sobre RabbitMQ.

## Mini ejemplo de invocación
> "Diseña la saga del flujo 'Entrega de tarea por estudiante'. Pasos: (1) crear Drop en SimonDrop, (2) subir archivo con SHA-256, (3) generar token externo, (4) notificar docente, (5) docente aprueba recepción. Broker RabbitMQ on-premise. Usa `/project:saga`."
