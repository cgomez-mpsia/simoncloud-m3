# Skill: simoncloud-ipc-selector

## Role
Seleccionas el estilo y tecnología de Inter-Process Communication (IPC) por cada flujo entre los 7 microservicios de SimonCloud. Aplicas la matriz de estilos de interacción (sync one-to-one, async one-to-one, async one-to-many), decides entre REST/NestJS, gRPC o RabbitMQ, defines Service Discovery y mitiga Hidden Coupling.

## Activation context
Activar cuando: los microservicios están identificados y se necesita poblar DTI §6 (IPC por flujo). NO activar si los servicios aún no están definidos.

## Context / Inputs requeridos
- Lista de pares productor → consumidor entre los 7 microservicios de SimonCloud.
- Para cada par: caso de uso, latencia tolerable, ordering requerido, fan-out, replay, acoplamiento aceptable.
- Restricciones: on-premise Docker Swarm (NO servicios cloud-managed como SQS o EventBridge); broker disponible RabbitMQ; MinIO para binarios.
- `AGENTS.md` — stack autoritativo: NestJS + Prisma + RabbitMQ + MinIO.

## Reasoning (pasos en orden)

1. **Verificar inputs**: si faltan criterios duros por flujo, STOP.
2. **Aplicar la matriz de estilos** por flujo:

   | Estilo | Cuándo usarlo en SimonCloud |
   |--------|------------------------------|
   | One-to-one síncrono (REST) | Query que necesita respuesta inmediata para responder al cliente HTTP; latencia < 1 s |
   | One-to-one asíncrono (RabbitMQ direct queue) | Comando con resultado diferido (procesamiento pesado de archivos, pagos); latencia tolerada > 1 s |
   | One-to-many asíncrono (RabbitMQ fanout/topic) | Domain Event / Integration Event cross-context (notificaciones, audit log) |

3. **Para flujos síncronos**: REST + OpenAPI (default SimonCloud NestJS) vs gRPC:
   - **REST + OpenAPI + SemVer**: standard para todos los flujos HTTP internos y externos. Versionado por URL (`/v1`, `/v2`).
   - **gRPC**: solo para internal east-west con latencia ultra-crítica (< 50 ms) y stack polyglot. NUNCA exponer al browser.
4. **Para flujos asíncronos**: RabbitMQ es el broker on-premise de SimonCloud.
   - `direct` exchange: task queue / comando con ACK.
   - `topic` exchange: routing por pattern (ej. `simoncloud.drops.*`).
   - `fanout` exchange: broadcast a todos los consumers.
   - Sin replay nativo — usar PostgreSQL `outbox_events` como event log si se necesita replay.
5. **Service Discovery en Docker Swarm**: DNS interno de Swarm (`http://service-name:port`) — server-side LB automático con replicas. No se necesita Consul/Eureka.
6. **Mitigar Hidden Coupling**: si A → B → C → D síncronos en cascada → disponibilidad combinada cae. Convertir saltos intermedios a async o introducir Circuit Breaker.
7. **Para REST/NestJS**: declarar versionado, timeout, política de retry, idempotency-key en POST/PATCH.
8. **Para RabbitMQ**: declarar exchange type, queue, guarantía (at-least-once), DLQ, prefetch.
9. **Producir tabla IPC** para DTI §6.

## Stop condition
Detente cuando: cada flujo tiene estilo, tecnología, justificación ≥ 2 dimensiones, timeout/retry o queue config, y Plan B.

## Output esperado

Tabla en `docs/DTI.md §6`:

| Flujo | Productor → Consumidor | Estilo | Tecnología | Justificación (≥ 2 dim.) | Versionado / exchange | Plan B |
|-------|------------------------|--------|------------|--------------------------|----------------------|--------|
| Autenticación SSO | Gateway → Auth | One-to-one sync | REST + OpenAPI | latencia < 200 ms, JWT stateless en respuesta | `/v1/auth/validate` | Cache JWT localmente con TTL 5 min si Auth no responde |
| Upload binario a MinIO | SimonDrop svc → MinIO | One-to-one sync | MinIO SDK (HTTP presigned URL) | upload directo cliente → MinIO vía presigned URL; evita proxy del servicio | SDK `@aws-sdk/client-s3` compat. | Fallback a subida bufferizada si presigned falla |
| Notificar entrega archivo | SimonDrop → Notificaciones | One-to-many async | RabbitMQ topic exchange | fan-out a email + push + audit; ordering no crítico | exchange `simoncloud.events`, key `drops.archivo.subido`, at-least-once, DLQ | Si RabbitMQ caído: reintento desde outbox_events tras reconexión |
| Generar PDF certificado | SimonDrop → PdfService | One-to-one async | RabbitMQ direct queue | procesamiento pesado ~5 s; latencia tolerada; retry built-in | queue `pdf-generation`, prefetch 5, DLQ `pdf-dlq` | Timeout 30 s; si DLQ llena, alerta a admin |
| Pago QR Simple Bolivia | Pagos → QR Provider | One-to-one sync | REST + OpenAPI | pago requiere respuesta inmediata para UX; con CB si provider falla | `/v1/payments/qr`, CB + retry max 3 | Encolar pago para reintentar; notificar usuario |

Plus: bullets de Hidden Coupling detectado y mitigaciones aplicadas.

## Invariantes
- MUST NOT: gRPC expuesto al browser.
- MUST: Idempotency-Key header en todo POST/PATCH con efecto colateral (creación Drop, pago).
- MUST NOT: Timeout > 30 s en llamadas sync (hilo bloqueado + cascade failure).
- MUST: DLQ configurada para toda queue RabbitMQ crítica.
- MUST: Service Discovery via DNS de Docker Swarm (no URLs hardcodeadas).
- MUST NOT: RabbitMQ usado como event log con replay — usar `outbox_events` PostgreSQL.

## Anti-patrones específicos SimonCloud
- **Hidden Coupling Gateway→SimonDrop→MinIO→Auth sync en cascada**: 4 saltos sync → disponibilidad 0.99^4 = 96 %. Mitigación: async para notificaciones; CB en cada salto sync.
- **MinIO como intermediario de mensajes**: MinIO es object storage, no broker. Solo usar para binarios con presigned URL.
- **Async fire-and-forget sin DLQ para emails de notificación**: mensajes perdidos silenciosamente. Mitigación: DLQ + alerta si DLQ > 0.

## Mini ejemplo de invocación
> "Diseña el IPC de SimonCloud. Flujos: (1) Gateway valida JWT con Auth (< 100 ms); (2) SimonDrop sube PDF a MinIO (directo); (3) SimonDrop notifica entrega a Notificaciones (fan-out async); (4) SimonDrop encarga PDF certificado a PdfService (async heavy). Docker Swarm on-premise, RabbitMQ. Usa `/project:ipc-selector`."
