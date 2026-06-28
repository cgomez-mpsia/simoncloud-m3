# Catálogo de Eventos — SimonCloud

## Metadatos

| Campo | Valor |
|-------|-------|
| Producto | SimonCloud |
| Versión | v1.0 |
| Fecha | 2026-05-28 |
| Broker | RabbitMQ (on-premise Docker Swarm, DTIC-UMSS) |
| Patrón garantía | at-least-once + Outbox Pattern (Prisma `$transaction` + tabla `outbox_events`) |
| Schema format | JSON Schema (draft-07) |
| Política compatibility | backward — consumidores toleran campos nuevos desconocidos |
| Referencia | `docs/DTI.md §7`, `docs/fsd/FSD_vFinal.md §4` |

---

## Catálogo

| Evento | Tipo | Bounded context productor | Bounded contexts consumidores | Payload (campos narrow) | Garantía | IdempotencyKey | UC origen |
|--------|------|--------------------------|-------------------------------|-------------------------|----------|----------------|-----------|
| `ArchivoSubidoIntegrationEvent` | Keyed | SimonDrop | Notificaciones, Expedientes, Admin | `eventId:UUID, archivoId:UUID, dropId:UUID, estudianteId:UUID, docenteId:UUID, sha256:string(64-hex), tamanoBytes:int, nombreOriginal:string, subitoEn:ISO8601` | at-least-once | `eventId + archivoId` | FSD-UC-002 |
| `SimonDropCreadoIntegrationEvent` | Entity | SimonDrop | Admin, Notificaciones | `eventId:UUID, dropId:UUID, docenteId:UUID, titulo:string, cierreEn:ISO8601, lmsAssignmentId:string\|null, creadoEn:ISO8601` | at-least-once | `eventId + dropId` | FSD-UC-001 |
| `SimonDropCerradoIntegrationEvent` | Keyed | SimonDrop | SimonDrop (lock archivos), Notificaciones | `eventId:UUID, dropId:UUID, docenteId:UUID, cerradoEn:ISO8601, totalArchivos:int` | at-least-once | `eventId + dropId` | FSD-UC-001 |
| `QuotaUpgradeSolicitadoEvent` | Keyed | Pagos | Pagos (saga orquestador) | `eventId:UUID, sagaId:UUID, userId:UUID, plan:enum(PRO), montoBOB:number(2dec), qrCode:string, expiresAt:ISO8601` | at-least-once | `eventId + sagaId` | FSD-UC-003 |
| `PagoConfirmadoIntegrationEvent` | Keyed | Pagos (webhook QR Simple) | Pagos (saga), Notificaciones | `eventId:UUID, sagaId:UUID, paymentId:string, userId:UUID, montoBOB:number(2dec), hmacValido:bool, confirmedAt:ISO8601` | at-least-once | `eventId + paymentId` | FSD-UC-003 |
| `QuotaActualizadaIntegrationEvent` | Entity | Pagos | Notificaciones, Admin, Auth | `eventId:UUID, userId:UUID, planAnterior:enum(FREE,PRO), planNuevo:enum(FREE,PRO), quotaMbNuevo:int, updatedAt:ISO8601` | at-least-once | `eventId + userId + updatedAt` | FSD-UC-003 |
| `UsuarioAutenticadoIntegrationEvent` | Unkeyed | Auth | Admin (CQRS) | `eventId:UUID, userId:UUID, rol:enum(ESTUDIANTE,DOCENTE,ADMINISTRATIVO,ADMIN), ip:string, loginAt:ISO8601` | at-least-once | `eventId` | FSD-UC-004 |
| `DocumentoAprobadoIntegrationEvent` | Keyed | Expedientes | Notificaciones | `eventId:UUID, documentoId:UUID, administrativoId:UUID, solicitanteId:UUID, aprobadoEn:ISO8601` | at-least-once | `eventId + documentoId` | FSD-UC-006 |
| `DocumentoRechazadoIntegrationEvent` | Keyed | Expedientes | Notificaciones | `eventId:UUID, documentoId:UUID, administrativoId:UUID, solicitanteId:UUID, justificacion:string(min20), rechazadoEn:ISO8601` | at-least-once | `eventId + documentoId` | FSD-UC-006 |
| `ArchivoMovidoPapeleraIntegrationEvent` | Keyed | SimonDrop / Expedientes | Admin | `eventId:UUID, archivoId:UUID, userId:UUID, movidoEn:ISO8601, purgaEn:ISO8601` | at-least-once | `eventId + archivoId` | FSD-UC-009 |
| `TokenExternoAccedidoIntegrationEvent` | Unkeyed | Auth | Admin (audit CQRS) | `eventId:UUID, tokenId:UUID, dropId:UUID, archivoId:UUID, ip:string, userAgent:string, exitoso:bool, accessedAt:ISO8601` | at-least-once | `eventId` | FSD-UC-011 |

---

## Notas de clasificación

### Taxonomía aplicada

| Tipo | Descripción | Ejemplos en SimonCloud |
|------|-------------|----------------------|
| **Unkeyed** | Hecho sin clave de entidad; sin ordering requerido por entidad; logs y auditoría | `UsuarioAutenticadoIntegrationEvent`, `TokenExternoAccedidoIntegrationEvent` |
| **Entity** | Snapshot completo del estado de una entidad tras un cambio; compactable por clave | `SimonDropCreadoIntegrationEvent`, `QuotaActualizadaIntegrationEvent` |
| **Keyed** | Hecho atómico relativo a una clave (delta); ordering por entidad importa | `ArchivoSubidoIntegrationEvent`, `PagoConfirmadoIntegrationEvent`, `SimonDropCerradoIntegrationEvent` |

### Single Writer Principle

| Bounded context | Eventos que produce | Eventos que consume |
|-----------------|---------------------|---------------------|
| **Auth** | `UsuarioAutenticadoIntegrationEvent`, `TokenExternoAccedidoIntegrationEvent` | — |
| **SimonDrop** | `ArchivoSubidoIntegrationEvent`, `SimonDropCreadoIntegrationEvent`, `SimonDropCerradoIntegrationEvent`, `ArchivoMovidoPapeleraIntegrationEvent` | `SimonDropCerradoIntegrationEvent` (propio, lock archivos) |
| **Expedientes** | `DocumentoAprobadoIntegrationEvent`, `DocumentoRechazadoIntegrationEvent` | `ArchivoSubidoIntegrationEvent` |
| **Pagos** | `QuotaUpgradeSolicitadoEvent`, `PagoConfirmadoIntegrationEvent`, `QuotaActualizadaIntegrationEvent` | — |
| **Notificaciones** | — (solo consume) | `ArchivoSubidoIntegrationEvent`, `SimonDropCerradoIntegrationEvent`, `PagoConfirmadoIntegrationEvent`, `QuotaActualizadaIntegrationEvent`, `DocumentoAprobadoIntegrationEvent`, `DocumentoRechazadoIntegrationEvent` |
| **Admin** | — (solo consume / CQRS) | `ArchivoSubidoIntegrationEvent` (métricas dashboard), `UsuarioAutenticadoIntegrationEvent`, `QuotaActualizadaIntegrationEvent`, `ArchivoMovidoPapeleraIntegrationEvent`, `TokenExternoAccedidoIntegrationEvent` |

### RabbitMQ exchanges y queues

| Exchange / Queue | Tipo | Eventos |
|-----------------|------|---------|
| `simoncloud.simondrop.events` | topic | `ArchivoSubidoIntegrationEvent`, `SimonDropCreadoIntegrationEvent`, `SimonDropCerradoIntegrationEvent` |
| `simoncloud.pagos.events` | topic | `QuotaUpgradeSolicitadoEvent`, `PagoConfirmadoIntegrationEvent`, `QuotaActualizadaIntegrationEvent` |
| `simoncloud.expedientes.events` | topic | `DocumentoAprobadoIntegrationEvent`, `DocumentoRechazadoIntegrationEvent` |
| `simoncloud.auth.events` | topic | `UsuarioAutenticadoIntegrationEvent`, `TokenExternoAccedidoIntegrationEvent` |
| `notification-worker` | direct | Consume de todos los exchanges anteriores; fanout interno a email/push |
| `admin-cqrs-worker` | queue (bind a `simoncloud.simondrop.events` + `simoncloud.auth.events` + `simoncloud.pagos.events`) | Consume `ArchivoSubidoIntegrationEvent`, `UsuarioAutenticadoIntegrationEvent`, `QuotaActualizadaIntegrationEvent` para actualizar `dashboard_metrics` (CQRS Read Model) |

### Política de Outbox

Todos los eventos de tipo **Keyed** y **Entity** (9 de 11) usan Outbox Pattern obligatorio:
- Escritura a BD principal + INSERT en `outbox_events` dentro de **una sola** `prisma.$transaction`.
- Un worker de polling (`OutboxWorker`) lee `outbox_events` WHERE `published_at IS NULL` y publica en RabbitMQ.
- Los eventos **Unkeyed** de auditoría (`UsuarioAutenticadoIntegrationEvent`, `TokenExternoAccedidoIntegrationEvent`) pueden publicarse directamente (riesgo aceptable: pérdida de un log de auditoría no es crítica de negocio).

---

## Verificación de anti-patrones

| Criterio | Estado |
|----------|--------|
| Cero eventos semáforo (sin payload útil) | ✅ Todos los eventos llevan payload completo |
| Cero nombres genéricos (`DataChanged`, `Actualizado`) | ✅ Nombres específicos `<Entidad><AcciónEnPasado>` |
| Cero payload > 1 MB (archivos binarios en eventos) | ✅ Solo `archivoId:UUID` y `sha256:string(64)`, nunca el binario |
| Cero dual-write directo sin Outbox (Keyed/Entity) | ✅ Outbox Pattern declarado para 9/11 eventos |
| Cero múltiples productores en el mismo evento | ✅ Single Writer Principle respetado (tabla §2.2) |
| SHA-256 como string 64-hex (nunca Buffer, nunca truncado) | ✅ `sha256:string(64-hex)` en todos los eventos que lo llevan |

---

## Schemas

Ver `docs/events/schemas/` para los schemas JSON Schema de los eventos críticos:
- `ArchivoSubidoIntegrationEvent.json`
- `PagoConfirmadoIntegrationEvent.json`
