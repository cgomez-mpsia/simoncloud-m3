# SimonCloud — Instrucciones persistentes para Claude Code

Proyecto: **SimonCloud** — Plataforma institucional de almacenamiento académico UMSS  
Rama activa: `release/2.0.0` | Grupo: G01 | Integrante único: Carlos Alberto Gomez Ormachea  
Documentación canónica: `docs/DTI.md`, `docs/fsd/FSD_vFinal.md`, `docs/api/openapi.yaml`

---

## 1. Trazabilidad obligatoria (AI-SDLC)

Todo prompt que produzca cambios en archivos versionados **DEBE** registrar una entrada
en `docs/PROMPT_MAPPING.md` sección `## Bitácora de Sesiones` **antes o junto con** el commit.

**Cuándo registrar:** cambios en código, esquemas, configuración o documentación versionada.  
**No registrar:** preguntas conceptuales, lecturas, exploración sin cambios.

**Formato de ID:** `PM-YYYYMMDD-NNN` (NNN reinicia cada día: 001, 002, …)

**Campos requeridos por entrada:**
- `Timestamp`: ISO 8601 con offset `-04:00` (Bolivia)
- `Intent`: `feature | fix | schema | refactor | docs | chore | security`
- `Artefactos generados`: lista de paths relativos
- `Trazabilidad`: FSD-UC-XXX o DTI §X afectados
- `Verificación`: `applied | pending | failed`

**Append-only**: nunca editar entradas previas. Para corregir, nueva entrada con `Intent: fix`.

---

## 2. Stack tecnológico — convenciones obligatorias

### Backend
- **Runtime**: NestJS 10 + TypeScript strict mode
- **ORM**: Prisma 5 — usar `$transaction` para operaciones atómicas
- **BD**: PostgreSQL 16 on-premise (primary + hot-standby DTIC-UMSS)
- **Cache**: Redis 7 Cluster (3 nodos, Consistent Hashing)

### Mensajería — NUNCA usar SQS, Kafka, BullMQ ni EventBridge
- **Broker**: RabbitMQ on-premise con exchanges `topic`
- **Exchanges**: `simoncloud.simondrop.events`, `simoncloud.pagos.events`, `simoncloud.expedientes.events`, `simoncloud.auth.events`
- **Outbox Pattern obligatorio** para todos los eventos Keyed y Entity (ver §4)

### Storage — NUNCA usar S3 directo ni GCS
- **Object Storage**: MinIO on-premise con API S3-compatible (`@aws-sdk/client-s3` apuntando a MinIO)
- **WORM**: Object Lock activado en buckets de SimonDrops cerrados

### Infraestructura — NUNCA mencionar AWS/GCP/Azure como destino de despliegue
- **Orquestación**: Docker Swarm on-premise DTIC-UMSS
- **7 microservicios**: `auth-service`, `file-service`, `simondrop-service`, `quota-service`, `expedientes-service`, `notification-service`, `admin-service`
- **Secretos**: Docker Secrets / HashiCorp Vault — NUNCA AWS Secrets Manager, NUNCA hardcoded

### Frontend
- **Framework**: React 18 + TypeScript + Vite + Tailwind CSS
- **Router**: React Router v6
- **HTTP**: axios o fetch nativo — nunca SDKs de AWS directamente en frontend

---

## 3. Invariantes de dominio — NUNCA violar

| Invariante | Regla |
|---|---|
| SHA-256 | Siempre `string` de 64 chars hex lowercase. Nunca `Buffer`, nunca truncado, nunca base64 |
| montoBOB | `number` con `multipleOf: 0.01`. Nunca `float` sin control de precisión |
| UUIDs | Siempre v4. Nunca autoincrement como PK de entidades de dominio |
| Timestamps | UTC para almacenamiento. `America/La_Paz` solo para display |
| Token externo | HMAC-SHA256, TTL máximo 72h. El endpoint retorna 403 sin revelar el recurso si inválido (BR-011) |
| Archivos cerrados | Inmutables (WORM). Nunca permitir UPDATE/DELETE sin rol Administrativo |
| Roles | `ESTUDIANTE | DOCENTE | ADMINISTRATIVO | ADMIN` — asignados por WebSISS SSO, no editables por usuario |

---

## 4. Outbox Pattern — implementación obligatoria

Para cualquier evento de tipo **Keyed** o **Entity** (9 de 11 en el catálogo):

```typescript
// CORRECTO — atómico
await prisma.$transaction(async (tx) => {
  await tx.archivo.update({ where: { id }, data: { ... } });
  await tx.outboxEvent.create({ data: {
    eventType: 'ArchivoSubidoIntegrationEvent',
    payload: JSON.stringify(event),
  }});
});
// OutboxWorker publica en RabbitMQ leyendo WHERE published_at IS NULL

// INCORRECTO — dual-write sin outbox (nunca hacer esto)
await prisma.archivo.update({ ... });
await rabbitChannel.publish(...); // puede fallar dejando estado inconsistente
```

---

## 5. Arquitectura Hexagonal — reglas de importación

```
domain/          ← NUNCA importa de infra, adapter ni framework
application/     ← importa solo domain/
adapter/in/      ← importa application/ y domain/
adapter/out/     ← implementa ports de domain/
```

- El `file-service` es el módulo crítico con hexagonal completa.
- Los ports (`FileStoragePort`, `EventPublisherPort`) viven en `domain/port/out/`.
- Los adapters de Prisma, MinIO y RabbitMQ viven en `adapter/out/`.
- Los tests unitarios del dominio **no instancian Prisma ni MinIO** — usan mocks de ports.

---

## 6. Eventos — convenciones de nomenclatura

- Nombre: `<Entidad><AcciónEnPasado>IntegrationEvent` (ej. `ArchivoSubidoIntegrationEvent`)
- Siempre incluir: `eventId: UUID v4`, `eventType: const string`, `eventVersion: "1.0"`
- `eventId` es el idempotency key primario — consumidores deben deduplicar por él
- Schemas JSON Schema draft-07 en `docs/events/schemas/`
- Single Writer Principle: un solo bounded context produce cada evento

---

## 7. Testing

- **Framework**: Jest + Supertest (nunca Mocha, nunca Cucumber-JVM)
- **Mocks HTTP**: nock o MSW (nunca Wiremock)
- **Tests de integración**: usan base de datos real (nunca mock de Prisma)
- **Cobertura mínima dominio**: 80% (umbral NFR-008)
- **Comando**: `npm run test` — nunca `mvn verify`

---

## 8. Git — política de commits

- **NUNCA hacer push** — solo commits. El usuario (Beto) hace los push.
- Formato Conventional Commits: `type(scope): descripción`
- Tipos válidos: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`
- Siempre incluir `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- No usar `--no-verify`, `--force`, ni `git push` salvo instrucción explícita

---

## 9. Documentación — archivos canónicos

| Artefacto | Archivo canónico | NO usar |
|---|---|---|
| Arquitectura | `docs/DTI.md` | `docs/dti/DTI_v2.md` (borrador) |
| Spec funcional | `docs/fsd/FSD_vFinal.md` | `docs/fsd/FSD_v1.md` |
| BRD | `docs/brd/BRD_vFinal.md` | `docs/brd/BRD.md`, `BRD_v2.md` |
| API REST | `docs/api/openapi.yaml` | — |
| Eventos | `docs/events/catalog.md` + `schemas/` | — |
| ADRs | `docs/adr/00NN-*.md` (6 ADRs) | — |
| Trazabilidad AI | `docs/PROMPT_MAPPING.md` | — |

---

## 10. Slash commands disponibles

En `.claude/commands/` hay 12 comandos especializados para este proyecto:

| Comando | Propósito |
|---|---|
| `/arch-reviewer` | Auditoría de 30 criterios de arquitectura |
| `/async-reviewer` | Auditoría EDA — Outbox, idempotencia, compensaciones |
| `/event-catalog` | Diseñar/revisar eventos de integración |
| `/saga` | Diseñar sagas orquestadas con compensaciones |
| `/ddd-aggregate` | Diseñar aggregates, VOs y domain events |
| `/uc-to-slice` | Implementar un FSD-UC como vertical slice NestJS |
| `/gherkin-to-tests` | Convertir escenarios Gherkin a tests Jest/Supertest |
| `/openapi-spec` | Generar/revisar spec OpenAPI 3.1 |
| `/resilience` | Circuit Breaker, retry, bulkhead con parámetros SimonCloud |
| `/ipc-selector` | Elegir patrón de comunicación entre servicios |
| `/adr-recorder` | Redactar un ADR con ≥3 opciones y trade-offs |
| `/dti-author` | Completar secciones del DTI vFinal |

---

## 11. Configuración de Claude Code — settings.json vs settings.local.json

Dos archivos de configuración con propósitos distintos:

| Archivo | Versionado | Contenido permitido |
|---|---|---|
| `.claude/settings.json` | **Sí** (commiteado) | Solo config/permisos **portables** útiles a cualquier agente o máquina: globs genéricos (`npm run *`, `npx prisma *`, `git checkout *`), hooks compartidos, env del proyecto. |
| `.claude/settings.local.json` | **No** (en `.gitignore`) | Todo lo específico de **esta** máquina: rutas absolutas (`/Users/.../`), `additionalDirectories`, permisos one-off, credenciales/env locales. |

**Reglas para los agentes:**
- Nunca escribir rutas absolutas ni permisos one-off en `settings.json`.
- Permisos aprobados "no volver a preguntar" → van a `settings.local.json` (comportamiento por defecto de Claude Code).
- Si un permiso es genuinamente reutilizable por el equipo, promoverlo manualmente a `settings.json` como glob portable.
