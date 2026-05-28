# Skill: simoncloud-event-catalog

## Role
Construyes y mantienes el catálogo de eventos de SimonCloud en `docs/events/catalog.md` y los schemas en `docs/events/schemas/`. Aplicas la taxonomía Unkeyed/Entity/Keyed, el Single Writer Principle y los anti-patrones de eventos. No inventas eventos fuera del FSD.

## Activation context
Activar cuando: el FSD ya existe y se necesita definir la comunicación entre bounded contexts de los 7 microservicios de SimonCloud. NO activar si el FSD aún no tiene UCs cross-context.

## Context / Inputs requeridos
- `docs/fsd/FSD_vFinal.md` — UCs cross-context identificados.
- `AGENTS.md` — broker autoritativo (RabbitMQ sobre Docker Swarm on-premise).
- Bounded contexts de SimonCloud: Auth, SimonDrop, Expedientes, Notificaciones, Pagos, AdminPanel, Gateway.

## Reasoning (pasos en orden)

1. **Verificar inputs**: si faltan UCs cross-context, STOP.
2. **Extraer candidatos**: por cada UC del FSD que modifica estado relevante para otro bounded context, proponer Integration Event con nombre `<Entidad><AcciónEnPasado>IntegrationEvent`.
3. **Clasificar cada evento**:
   - **Unkeyed**: hecho sin clave (logs de acceso, métricas). Sin ordering por entidad.
   - **Entity**: estado completo de la entidad tras el cambio. Compactable por clave. Ejemplo: `DropActualizadoIntegrationEvent`.
   - **Keyed**: hecho atómico relativo a una clave (delta). Ejemplo: `ArchivoSubidoIntegrationEvent`.
4. **Asignar productor único** (Single Writer Principle). Si dos servicios pretenden escribir el mismo evento → reorganizar.
5. **Definir payload con tipos narrow**: UUIDs explícitos, SHA-256 como string 64-hex, timestamps ISO 8601 UTC, montos en BOB como `number` con 2 decimales (nunca `float`/`double`).
6. **Declarar garantía e idempotency key**: at-least-once + `eventId:UUID` + `entityId` + `version`. Effectively-once solo con ADR justificado.
7. **Validar contra anti-patrones**: eventos semáforo, Frankenstein, payload gigante, nombres genéricos.
8. **Generar schemas semilla JSON Schema** (no Avro — SimonCloud usa RabbitMQ, no Kafka) para al menos 2 eventos críticos. Declarar política backward/forward/full.
9. **Outbox Pattern obligatorio**: cualquier evento emitido desde un servicio que también escribe a PostgreSQL debe usar INSERT en `outbox_events` dentro de la misma transacción Prisma.

## Stop condition
Detente cuando: ≥ 6 eventos en catálogo, todos con productor único, idempotency key, clasificación taxonómica, y ≥ 2 schemas JSON Schema en `docs/events/schemas/`.

## Output esperado

- `docs/events/catalog.md` con tabla:

| Evento | Tipo | Bounded context productor | Consumidores | Payload (campos narrow) | Garantía | IdempotencyKey | UC origen |
|--------|------|--------------------------|--------------|-------------------------|----------|----------------|-----------|
| ArchivoSubidoIntegrationEvent | Keyed | SimonDrop | Notificaciones, Expedientes | dropId:UUID, archivoId:UUID, sha256:string(64), tamanoBytes:int, subitoEn:ISO8601 | at-least-once | eventId+archivoId | FSD-UC-002 |
| TokenExternoGeneradoIntegrationEvent | Keyed | SimonDrop | Auth, Notificaciones | tokenId:UUID, dropId:UUID, expiresAt:ISO8601, sha256Archivo:string(64) | at-least-once | eventId+tokenId | FSD-UC-004 |

- `docs/events/schemas/<Evento>.json` con al menos 2 schemas JSON Schema y nota de compatibility:
  ```json
  // Política de compatibility: backward
  // Productor único: SimonDrop bounded context
  // Consumidores: Notificaciones, Expedientes
  ```

## Invariantes
- MUST: SHA-256 siempre como string de exactamente 64 caracteres hex en el payload (nunca Buffer, nunca truncado).
- MUST: Outbox Pattern para toda emisión que acompaña escritura en BD.
- MUST NOT: Avro schemas — SimonCloud usa JSON Schema (RabbitMQ sin Schema Registry).
- MUST: Cada evento mapeado a un UC del FSD.
- MUST NOT: Evento `DataChanged` ni `Actualizado` genérico — nombres específicos por cambio.

## Anti-patrones específicos SimonCloud
- **Evento semáforo**: `DropActualizado` sin payload útil → consumidor debe volver a consultar. Mitigación: payload con todo lo necesario.
- **SHA-256 como Buffer en evento**: serialización inconsistente entre servicios Node.js. Mitigación: siempre string hex.
- **Doble escritura sin Outbox**: UPDATE archivo + publish RabbitMQ en pasos separados. Mitigación: Prisma `$transaction` + `outbox_events`.

## Mini ejemplo de invocación
> "Construye el catálogo de eventos de SimonCloud. FSD en `docs/fsd/FSD_vFinal.md`. Bounded contexts: Auth, SimonDrop, Expedientes, Notificaciones. Genera catalog.md + schemas de los 2 eventos más críticos. Usa el skill `/project:event-catalog`."
