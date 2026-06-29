# PROMPT_MAPPING.md — Trazabilidad de Prompts AI-SDLC — SimonCloud

> **Ética y Trazabilidad**: Este archivo es el **Prompt Log Obligatorio** del proyecto. Documenta todos los artefactos generados con asistencia de IA. Bajo el paradigma AI-SDLC, si no hay prompt log, no hay auditoría.

---

## Índice de Trazabilidad

> **Leyenda de estados**: `applied` = prompt ejecutado, artefacto revisado y aceptado, **código commiteado en el repo** (POC o implementación). `contrato-listo` = prompt-contrato generado y aceptado; implementación planificada para Módulo 5 (no hay código en `release/2.0.0`).

| ID Prompt | Artefacto generado | FSD-UC | Modelo | Estado |
|-----------|-------------------|--------|--------|--------|
| `PR-BRD-001` | Auditoría de coherencia BRD | — | Claude Sonnet 4 | applied |
| `PR-UC-001` | `createLtiDeepLink()` contrato TypeScript | FSD-UC-001 | Claude Sonnet 4 | contrato-listo |
| `PR-UC-002` | `generateFileHash()` SHA-256 | FSD-UC-002 | Claude Sonnet 4 | applied |
| `PR-UC-003` | Stream Google Drive → S3 contrato | FSD-UC-008 | Claude Sonnet 4 | contrato-listo |
| `PR-UC-004` | Cronjob purga papelera 30 días contrato | FSD-UC-009 | Claude Sonnet 4 | contrato-listo |
| `PR-UC-005` | Componente React Uploader contrato | FSD-UC-002 (UI) | Claude Sonnet 4 | contrato-listo |
| `PR-UC-006` | NestJS Guard HMAC Webhook QR contrato | FSD-UC-003 | Claude Sonnet 4 | contrato-listo |
| `PR-UC-007` | GET /archivos/:id/versiones contrato | FSD-UC-005 | Claude Sonnet 4 | contrato-listo |
| `PR-UC-008` | Worker RabbitMQ notificaciones push contrato | FSD-UC-007 | Claude Sonnet 4 | contrato-listo |
| `PR-UC-009` | Export PDF audit log streaming contrato | FSD-UC-010 | Claude Sonnet 4 | contrato-listo |
| `PR-IMPL-001` | Slice NestJS acceso externo token HMAC (`docs/design/DD-UC-011.md`) | FSD-UC-011 | Claude Opus 4.8 | contrato-listo |

> **Leyenda capa viva (release/3.0.0+)**: los prompts de implementación viven en
> `docs/prompts/impl/PR-IMPL-NNN.md`, trazables vía `FSD-UC → DD-UC → PR-IMPL → código`.

---

## Mapeo Rápido Símbolo → Archivo → Métricas

| Símbolo | Archivo fuente | Sección | Antes (sin AI) | Después (con AI) |
|---------|---------------|---------|----------------|------------------|
| `createLtiDeepLink` (contrato) | `prompts/PR-UC-001.md` | FSD-UC-001 | Diseño manual estimado: 4h | Generado + revisado: 45min |
| `generateFileHash` (POC) | `pocs/POC-01/sha256-incremental.ts` | FSD-UC-002, BR-007 | Implementación manual: 30min | Generado + revisado: 5min |
| `QrSimpleWebhookGuard` (contrato) | `prompts/PR-UC-006.md` | FSD-UC-003, BR-010 | Diseño manual estimado: 2h | Generado + revisado: 20min |
| `processNotification` (contrato) | `prompts/PR-UC-008.md` | FSD-UC-007 | Diseño manual estimado: 3h | Generado + revisado: 30min |
| `exportAuditLogPdf` (contrato) | `prompts/PR-UC-009.md` | FSD-UC-010 | Diseño manual estimado: 4h | Generado + revisado: 45min |
| DTI vFinal (§1-§21) | `docs/DTI.md` | Arquitectura completa | Redacción manual: ~20h | Con AI: ~3h + revisión 1h |
| `FileService.upload` | `pocs/POC-03/backend/src/file/file.service.ts` | FSD-UC-002, DTI §5 | Implementación manual estimada: 6h | Generado + revisado: 40min |
| `MessageRelayService.relayPendingEvents` | `pocs/POC-03/backend/src/relay/message-relay.service.ts` | DTI §7.1 (Outbox) | Implementación manual estimada: 4h | Generado + revisado: 25min |
| `DropsService` | `pocs/POC-03/backend/src/drops/drops.service.ts` | FSD-UC-002, FSD-UC-004 | Implementación manual estimada: 3h | Generado + revisado: 20min |
| `AppHeader` + `Skeleton` | `pocs/POC-03/frontend/src/components/` | POC-03 UX | Implementación manual estimada: 2h | Generado + revisado: 15min |
| BRD v3.0 (LTI 1.3 rewrite) | `docs/brd/BRD_vFinal.md` | BRD §3,§6,§12-§21 | Reescritura manual estimada: 4h | Con AI: ~45min + revisión 15min |

---

## Bitácora de Sesiones (Append-Only)

### PM-20260511-001
- **Timestamp**: 2026-05-11T11:15:00-04:00
- **Intent**: docs
- **Artefactos generados**: `PRD_v1.md`, `FSD_v1.md` (UCs 1-3 iniciales)
- **Prompts**: `PR-UC-001`, `PR-UC-002`
- **Verificación**: applied — revisión humana completada

### PM-20260517-001
- **Timestamp**: 2026-05-17T11:15:00-04:00
- **Intent**: docs
- **Artefactos generados**: `FSD_v1.md` (UCs 4-10), `PRD_v1.md` expandido, `PROMPT_MAPPINGS.md`
- **Prompts**: `PR-UC-003` a `PR-UC-009`
- **Verificación**: applied

### PM-20260517-002
- **Timestamp**: 2026-05-17T11:28:00-04:00
- **Intent**: docs
- **Artefactos generados**: `AGENTS.md`, `.cursor/skills/*`
- **Verificación**: applied

### PM-20260518-001
- **Timestamp**: 2026-05-18T16:36:00-04:00
- **Intent**: docs
- **Artefactos generados**: `docs/dti/DTI_v2.md` (§1-§7 con CB, CH, microservicios)
- **Verificación**: applied

### PM-20260520-001
- **Timestamp**: 2026-05-20T17:53:00-04:00
- **Intent**: docs
- **Artefactos generados**: `docs/dti/patrones_asincronos.md` (Saga, Outbox, CQRS)
- **Verificación**: applied

### PM-20260527-001
- **Timestamp**: 2026-05-27T10:00:00-04:00
- **Intent**: docs
- **Artefactos generados**: `docs/DTI.md` (vFinal §1-§21), 5 ADRs, 8 diagramas .mmd, 2 POCs, prompts individuales, PROMPT_MAPPING.md, roadmap.md, release-2.0.0.md
- **Verificación**: applied — defensa final release/2.0.0

### PM-20260527-002
- **Timestamp**: 2026-05-27T20:00:00-04:00
- **Intent**: docs + fix
- **Artefactos generados**: `docs/brd/BRD_vFinal.md` (v3.0 — reescritura completa homologación → LTI 1.3 SimonDrop), `docs/adr/0005-cloud-provider-y-estilo-de-despliegue.md` (fix 8→7 servicios), `docs/DTI.md` (fix payment-service → quota-service), `docs/adr/0004-saga-orquestada-quota-upgrade.md`, `docs/dti/patrones_asincronos.md`, `docs/diagrams/05-saga-quota-upgrade.mmd`, `pocs/POC-02/README.md`
- **Verificación**: applied

### PM-20260528-001
- **Timestamp**: 2026-05-28T00:00:00-04:00
- **Intent**: poc
- **Artefactos generados**: `pocs/POC-03/` completo — demo app SimonDrop e2e con auth JWT + roles docente/estudiante + CRUD SimonDrops + upload archivos + folder upload + SHA-256 + MinIO + RabbitMQ (Outbox Pattern) + hexagonal architecture. Stack: React 18 + Vite + Tailwind + React Router v6 + NestJS 10 + Prisma 5 + PostgreSQL 16 + amqplib + @aws-sdk/client-s3 + Docker Compose.
- **Trazabilidad**: FSD-UC-002 (upload + SHA-256), FSD-UC-007 (notificación RabbitMQ), DTI §5 (hexagonal), DTI §7.1 (Outbox Pattern), ADR-0001, ADR-0005
- **Bugs resueltos**: BigInt JSON serialization (Prisma sizeBytes), JwtAuthGuard DI container, amqplib ChannelModel typing
- **Verificación**: applied — demo funcional en http://localhost:5173

### PM-20260528-012
- **Timestamp**: 2026-05-29T03:00:00-04:00
- **Intent**: fix
- **Artefactos generados**:
  - `docs/DTI.md` — §7.1: `UserRegisteredEvent` → `UsuarioAutenticadoIntegrationEvent` (alineado con catalog.md); §12.3: dos simplificaciones nuevas documentadas — JWT HS256 vs RS256 producción, y cron de cierre automático de SimonDrops
- **Trazabilidad**: DTI §7.1 (catálogo eventos), DTI §12.3 (simplificaciones POC-03), events/catalog.md (Single Writer)
- **Verificación**: applied

### PM-20260528-011
- **Timestamp**: 2026-05-29T02:00:00-04:00
- **Intent**: fix + docs
- **Artefactos generados**:
  - `docs/DTI.md` — §6.1 api-gateway: especificado como NestJS custom (no Kong/Traefik), valida JWT con RS256 clave pública, rate-limit con @nestjs/throttler; §7.4 CQRS: riesgo documentado de eventos Unkeyed sin Outbox (dashboard eventually consistent, audit_log es fuente autoritativa); §4.2 File Aggregate: cleanup job `@Cron('0 3 * * *')` para registros UPLOADING huérfanos (>2h), Módulo 5
- **Trazabilidad**: DTI §4.2 (ciclo de vida File), DTI §7.4 (CQRS riesgos), DTI §6.1 (API Gateway tech)
- **Verificación**: applied

### PM-20260528-010
- **Timestamp**: 2026-05-29T01:00:00-04:00
- **Intent**: fix
- **Artefactos generados**:
  - `docs/events/catalog.md` — Admin bounded context: añadido `ArchivoSubidoIntegrationEvent` (métricas dashboard); `admin-cqrs-worker` queue: documentados bindings a exchanges topic (simondrop + auth + pagos)
  - `docs/DTI.md` — §4.2 `PresignedUrl` VO: nota explicando que es producción, POC-03 usa buffer directo (ADR-0003)
  - `pocs/POC-03/backend/src/file/domain/presigned-url.vo.ts` — stub del VO `PresignedUrl` con validación de TTL; marcado como Módulo 5
- **Trazabilidad**: DTI §7.4 (CQRS admin), events/catalog.md (Single Writer), DTI §4.2 (VOs), ADR-0003
- **Verificación**: applied — 25/25 tests pasan

### PM-20260528-009
- **Timestamp**: 2026-05-29T00:00:00-04:00
- **Intent**: fix
- **Artefactos generados**:
  - `pocs/POC-03/backend/src/relay/message-relay.service.ts` — manejo de back-pressure AMQP: `channel.publish()` retorna `false` → `break` sin marcar publicado, se reintenta en ciclo siguiente
  - `docs/DTI.md` — §4.2 File Aggregate: nota POC-03 usa `UPLOADING/COMPLETED` (inglés), migración a nombres de dominio en Módulo 5; §8.1: PDFKit (`pdfkit` npm) como librería de recibos PDF en `file-service`
- **Trazabilidad**: DTI §7.1 (Outbox at-least-once), DTI §4.2 (ciclo de vida File), FSD-UC-002 (recibo PDF)
- **Verificación**: applied — 25/25 tests pasan

### PM-20260528-008
- **Timestamp**: 2026-05-28T23:30:00-04:00
- **Intent**: fix
- **Artefactos generados**:
  - `pocs/POC-03/backend/src/file/domain/sha256-hash.vo.ts` — Value Object `SHA256Hash` (branded type) + `createSHA256Hash()` con validación 64-hex invariante
  - `pocs/POC-03/backend/src/file/ports/file-storage.port.ts` — `uploadAndHash` retorna `Promise<SHA256Hash>` en lugar de `Promise<string>`
  - `pocs/POC-03/backend/src/file/adapters/s3-file.storage.ts` — usa `createSHA256Hash()` al retornar hash
  - `pocs/POC-03/backend/src/file/file.service.spec.ts` — mocks usan `createSHA256Hash()` para satisfacer tipo
  - `docs/DTI.md` — §6.2: DLQ nombrado `simoncloud.notifications.dlq` con parámetros RabbitMQ; §6.1: `expedientes-service` marcado como diseño sin POC/FSD-UC en release/2.0.0
- **Trazabilidad**: DTI §4.2 (SHA256Hash VO), CLAUDE.md §3 (SHA-256 invariante), DTI §6.2 (DLQ), DTI §6.1 (expedientes-service scope)
- **Verificación**: applied — 25/25 tests pasan

### PM-20260528-007
- **Timestamp**: 2026-05-28T23:00:00-04:00
- **Intent**: fix + docs
- **Artefactos generados**:
  - `docs/DTI.md` — §6.1: nota "Coexistencia JWT + HMAC-SHA256" explicando prefijos `/api/*` (JwtAuthGuard) vs `/external/*` (ExternalTokenGuard, security:[]); tabla api-gateway actualizada
- **Trazabilidad**: FSD-UC-011, ADR-0001, BR-011, CLAUDE.md §3 (Token externo)
- **Verificación**: applied

### PM-20260528-006
- **Timestamp**: 2026-05-28T22:00:00-04:00
- **Intent**: fix
- **Artefactos generados**:
  - `docs/DTI.md` — §13 amenazas: "HPA en file-service" → `docker service scale file-service=9` (Docker Swarm)
  - `docs/dti/patrones_asincronos.md` — `FileUploadedEvent` → `ArchivoSubidoIntegrationEvent`
  - `docs/diagrams/03-hexagonal-file-service.mmd` — `publish(FileUploadedEvent)` → `publish(ArchivoSubidoIntegrationEvent)`
  - `docs/diagrams/06-sequence-upload-hash.mmd` — `FileUploadedEvent` → `ArchivoSubidoIntegrationEvent` (2 ocurrencias)
  - `docs/fsd/FSD_vFinal.md` — diagramas mermaid: `AWS S3 / MinIO` → `MinIO (S3-compatible)` / `MinIO on-premise`
  - `docs/mrd/MRD_vFinal.md` — Tier 3: `Cloud (Supabase / AWS sa-east-1)` → cloud on-premise boliviano / VPS regional
  - `pocs/POC-03/backend/prisma/migrations/20260528011116_add_users_drops/` — migración Prisma trackeada en git
- **Trazabilidad**: CLAUDE.md §2 (Docker Swarm, nunca K8s), CLAUDE.md §6 (ArchivoSubidoIntegrationEvent), CLAUDE.md §2 (nunca AWS/GCP/Azure)
- **Verificación**: applied

### PM-20260528-005
- **Timestamp**: 2026-05-28T21:00:00-04:00
- **Intent**: fix + docs
- **Artefactos generados**:
  - `docs/DTI.md` — §12.3 Simplificaciones POC-03 vs producción (ADR-0003: single-PUT vs presigned URLs, Redis no validado, no multipart reanudable); §12.4 Componentes diseñados sin POC (MinIO Multipart, Redis Cluster, NFR-001 k6, NFR-005 JMeter, WORM); §7.3 Outbox idempotencia SQL; §8 nota WORM producción; §6.2 Docker Swarm (eliminado K8s HPA)
  - `docs/adr/0003-subida-reanudable-s3-multipart-vs-tus.md` — sección Validación: añadida nota ⚠️ POC-03 usa single-PUT (anti-patrón que ADR resuelve); arquitectura presigned URLs → POC-04 Módulo 5
  - `docs/fsd/FSD_vFinal.md` — tabla NFR §10: añadida columna Estado (✅ Verificado para NFR-002/NFR-008; ⏳ Pendiente Módulo 5 para NFR-001/003/004/005/006/007/009)
  - `infra/perf/nfr-001-upload.k6.js` — script k6 para NFR-001 (p95 < 30 s, 100 MB); thresholds: `http_req_duration p(95)<30000`, `http_req_failed rate<0.01`
- **Trazabilidad**: FSD §10 NFR-001/NFR-005/NFR-008, DTI §11/§12.3/§12.4, ADR-0003, CLAUDE.md §5 (hexagonal)
- **Verificación**: applied

### PM-20260528-003
- **Timestamp**: 2026-05-28T18:00:00-04:00
- **Intent**: fix
- **Artefactos generados**:
  - `pocs/POC-03/backend/src/relay/message-relay.service.ts` — `assertQueue` → `assertExchange` topic `simoncloud.simondrop.events`; `sendToQueue` → `channel.publish` con routing key derivado del eventType
  - `pocs/POC-03/backend/src/drops/drops.service.spec.ts` — añadidos tests `getOne()` y `listFiles()` para subir cobertura dominio ≥80%
  - `docs/roadmap.md` — eliminada referencia a AWS t3.micro/cost alerts; sustituida por riesgo on-premise DTIC
- **Trazabilidad**: CLAUDE.md §2 (exchanges topic), CLAUDE.md §7 + NFR-008 (cobertura ≥80%), CLAUDE.md §2 (no AWS como destino)
- **Verificación**: applied

### PM-20260528-002
- **Timestamp**: 2026-05-28T10:00:00-04:00
- **Intent**: docs + skills
- **Artefactos generados**:
  - `docs/fsd/FSD_vFinal.md` — agregado FSD-UC-011 (Acceso Usuario Externo: HMAC-SHA256, TTL 72h, 3 Gherkin scenarios, BR-011)
  - `docs/events/catalog.md` — catálogo completo de 11 eventos (taxonomía Unkeyed/Entity/Keyed, Single Writer, exchanges, anti-patrones)
  - `docs/events/schemas/ArchivoSubidoIntegrationEvent.json` — JSON Schema draft-07, SHA-256 64-hex pattern
  - `docs/events/schemas/PagoConfirmadoIntegrationEvent.json` — JSON Schema draft-07, montoBOB multipleOf 0.01
  - `docs/api/openapi.yaml` — OpenAPI 3.1 spec-first, 16 endpoints FSD-UC-001..FSD-UC-011, JWT Bearer, Idempotency-Key
  - `docs/adr/README.md` — índice de 6 ADRs con trazabilidad DTI/FSD
  - `.claude/commands/` — 12 slash commands: gherkin-to-tests, uc-to-slice, event-catalog, resilience, async-reviewer, saga, ddd-aggregate, ipc-selector, arch-reviewer, adr-recorder, dti-author, openapi-spec
  - `prompts/PR-UC-001.md` — corregido stale content: ahora documenta createLtiDeepLink (LTI 1.3) en lugar de homologateGrades (eliminado del proyecto)
  - `docs/aportes/release-2.0.0.md` — actualizado T-M4-024..029, total 29 tareas / ~85.5h
- **Trazabilidad**: FSD-UC-011, DTI §7 (events), DTI §8 (ADR-0005), Criterio 2/6/7 rubrica defensa
- **Verificación**: applied — commit pendiente

### PM-20260628-001
- **Timestamp**: 2026-06-28T15:10:00-04:00
- **Intent**: chore
- **Artefactos generados**:
  - `.gitignore` — ignorar solo `.claude/settings.local.json` (config local de esta máquina)
  - `.claude/settings.json` — depurado: solo permisos portables (globs reutilizables por cualquier agente)
  - `.claude/settings.local.json` — nuevo (no versionado): permisos con rutas absolutas y `additionalDirectories` de esta máquina
  - `CLAUDE.md` §11 — convención settings.json (compartido) vs settings.local.json (local) para todos los agentes
- **Trazabilidad**: cierre release/2.0.0 → main; CLAUDE.md §8 (política Git), §11 (config Claude Code)
- **Verificación**: applied

### PM-20260628-002
- **Timestamp**: 2026-06-28T15:25:00-04:00
- **Intent**: chore
- **Artefactos generados**:
  - `.claude/hooks/relocate-local-perms.py` — reubica permisos con rutas absolutas (`/Users/`, `/home/`) desde settings.json a settings.local.json; idempotente, fail-safe, con re-stage seguro (RELOCATE_RESTAGE)
  - `.claude/settings.json` — hooks `PreToolUse` (antes de cada `git commit`) y `SessionEnd` cableados al script
  - `CLAUDE.md` §11 — documentadas las dos redes de seguridad automáticas
- **Trazabilidad**: CLAUDE.md §11 (config Claude Code, settings.json vs local)
- **Verificación**: applied — flujo pre-commit verificado en repo temporal (settings.json staged se limpia, local no entra al commit); SessionEnd como barrido final

### PM-20260628-003
- **Timestamp**: 2026-06-28T16:10:00-04:00
- **Intent**: docs
- **Artefactos generados**:
  - **Transición M4→implementación** (modelo documental del docente): tag `release/2.0.0` (baseline congelado)
  - `docs/baseline/` — copias congeladas BRD/MRD/PRD/FSD/DTI vFinal + README (`status: congelado`)
  - `docs/product/` — `PRD.md`, `FSD.md` (vivos, LFSD ⚡) + `DTP.md` (Documento Técnico del Producto, nace del DTI)
  - `docs/design/`, `docs/prompts/impl/` — carpetas de la capa viva con README
  - `AGENTS.md` — regla **cobertura ≥90%**, protección del baseline, flujo diseño-primero
  - `CLAUDE.md` §12 — modelo de dos capas (congelado vs vivo); §7 cobertura 90%
  - `.github/CODEOWNERS` — protege `docs/baseline/`, DTP, AGENTS, CLAUDE
  - `.claude/commands/feature-design-doc.md`, `dtp-sync.md` — skills adaptados a rutas del repo
  - `docs/design/DD-UC-011.md` — design doc del feature del demo (FSD-UC-011, token externo HMAC). ADR evaluado → **no requerido** (decisión pre-existe en DTI §3)
  - `docs/prompts/impl/PR-IMPL-001.md` — prompt-contrato de implementación de UC-011 (no ejecutado)
- **Trazabilidad**: FSD-UC-011 → DD-UC-011 → PR-IMPL-001; modelo `templates/MODELO_DOCUMENTAL_IMPLEMENTACION.md`; consigna docente 19/06/2026
- **Verificación**: applied (documentación); código de UC-011 pendiente (diseño primero)

### PM-20260628-004
- **Timestamp**: 2026-06-28T16:35:00-04:00
- **Intent**: chore
- **Artefactos generados**:
  - `.claude/settings.json` — hook `PreToolUse` de tipo `agent` (`trace-auditor`, modelo Haiku) antes de cada `git commit`: audita `FSD-UC → DD-UC → PR-IMPL → PROMPT_MAPPING`, advisory, bloquea solo si se toca `docs/baseline/`
  - `AGENTS.md` §6 — agente `trace-auditor` documentado
  - `CLAUDE.md` §12 — auditor de trazabilidad automático documentado
- **Trazabilidad**: CLAUDE.md §1 (trazabilidad obligatoria), §12 (modelo documental); refuerza la regla con un guardián automático y barato
- **Verificación**: applied — JSON y schema del hook validados; requiere recargar config (`/hooks` o reinicio) para activarse en esta sesión

### PM-20260628-005
- **Timestamp**: 2026-06-28T17:05:00-04:00
- **Intent**: docs
- **Artefactos generados**:
  - `.claude/agents/trace-audit.md` — subagente read-only de auditoría completa del grafo de trazabilidad (Haiku); complementa al hook automático
  - **Ronda de gaps** ejecutada (escaneo de DD-coverage, integridad baseline, enlaces, consistencia de reglas) y corregida:
  - `CLAUDE.md` §9 — tabla canónica reescrita a 3 columnas (vivo `docs/product/` / congelado `docs/baseline/` / histórico M4) con regla de fuente-de-verdad
  - `AGENTS.md` §3 — estructura de repo actualizada con la capa viva (baseline/product/design/prompts/impl)
  - `.github/CODEOWNERS` — owner real (carlos.gomez.mpsia@est.umss.edu)
  - `templates/MODELO_DOCUMENTAL_IMPLEMENTACION.md`, `DTP_TEMPLATE.md`, `feature-design-doc-SKILL.md`, `dtp-sync-SKILL.md` — banners de mapeo de rutas docente→repo
- **Trazabilidad**: cierre de gaps de la transición M4→impl (PM-20260628-003/004); CLAUDE.md §9/§12, AGENTS.md §3
- **Verificación**: applied — integridad baseline confirmada (copias byte-idénticas a originales); regla de cobertura uniforme a 90%

### PM-20260628-006
- **Timestamp**: 2026-06-28T17:30:00-04:00
- **Intent**: docs
- **Prompt**: — (cambio de regla/config, sin código)
- **Artefactos generados**:
  - `CLAUDE.md` §1 — nuevo campo requerido **`Prompt`** en la entrada + regla específica: todo prompt que modifica código DEBE citar su ID (`PR-IMPL-NNN`/`PR-UC-NNN`)
  - `AGENTS.md` §6 — guardrail: el eslabón `prompt → código` es obligatorio en PROMPT_MAPPING
  - `.claude/settings.json` — hook `trace-auditor` exige el ID del prompt en commits con código
- **Trazabilidad**: refuerza CLAUDE.md §1 (trazabilidad obligatoria) por pedido del docente (entrada del prompt que modifica código)
- **Verificación**: applied — JSON del hook validado; la propia entrada estrena el campo `Prompt`

### PM-20260628-007
- **Timestamp**: 2026-06-28T18:00:00-04:00
- **Intent**: docs
- **Prompt**: — (decisión de arquitectura + design doc, sin código)
- **Artefactos generados**:
  - `docs/adr/0007-absorcion-design-system-supabase-ds.md` — ADR: absorber `supabase-ds` como DS de SimonCloud (Modelo B, agentes portados, mhtml gitignored, tema Supabase dark)
  - `docs/design/DD-SHELL-001.md` — design doc del cascarón (layout + routing + theme + integración DS)
  - `docs/adr/README.md`, `docs/design/README.md` — índices actualizados
- **Trazabilidad**: ADR-0007 → DD-SHELL-001; habilita FSD-UC-001/002/004/011; consigna del demo (cascarón antes de features)
- **Verificación**: applied (decisión documentada); ejecución de la absorción y scaffolding del shell pendiente de aprobación

### PM-20260628-008
- **Timestamp**: 2026-06-28T18:30:00-04:00
- **Intent**: chore
- **Prompt**: — (vendoring/absorción por ADR-0007; el código NO se generó por prompt, se copió)
- **Artefactos generados**:
  - `libs/design-system/` — DS absorbido de `supabase-ds`: `components/` (11 .tsx: atoms/molecules/organisms), `tokens/` (Supabase dark), `index.css`, `manifests/` (3), `package.json`, `README.md`
  - `.claude/agents/ds-page-analyzer.md`, `ds-component-builder.md` — agentes de extracción portados (Haiku/Sonnet, rutas adaptadas)
  - `.gitignore` — `libs/design-system/sources/` y `**/*.mhtml` (material fuente no versionado)
  - `docs/product/DTP.md` §A.1 — changelog de la absorción
- **Trazabilidad**: ADR-0007 → DD-SHELL-001; el DS es infraestructura (trazado por ADR, no por PR-IMPL)
- **Verificación**: applied — 11 componentes copiados, tokens y manifests presentes, mhtml gitignored

### PM-20260628-009
- **Timestamp**: 2026-06-28T18:55:00-04:00
- **Intent**: docs
- **Prompt**: — (corrección de gaps de consistencia, sin código)
- **Artefactos generados** (2ª ronda de gaps tras la absorción):
  - `docs/product/DTP.md` §B.1 — sub-sección "Arquitectura frontend" (DS + shell) que DD-SHELL-001 prometía
  - `AGENTS.md` §3 — `libs/design-system/` en la estructura; §6 — agentes `ds-page-analyzer`, `ds-component-builder`, subagente `trace-audit`
  - `CLAUDE.md` §10 — corregido conteo "12 comandos" + agregados `/feature-design-doc` y `/dtp-sync`
- **Trazabilidad**: cierra gaps de consistencia de PM-007/008 (absorción DS); DD-SHELL-001 ↔ DTP §B
- **Verificación**: applied — enlaces de ADR-0007/DD-SHELL-001 sin roturas; barrels completos; deps declaradas

### PM-20260628-010
- **Timestamp**: 2026-06-28T20:10:00-04:00
- **Intent**: chore
- **Prompt**: — (extracción vía agente `ds-page-analyzer`/general-purpose Haiku; convención de diseño)
- **Artefactos generados**:
  - `libs/design-system/manifests/` — 6 manifiestos nuevos extraídos de páginas Supabase (settings-general, auth-users, storage-files, table-editor, auth-emails, logs); ~40 componentes analizados (Input, FormField, CopyButton, DataTable, DropdownMenu, Select, FileDropzone, ProgressBar, EmptyState, etc.). Limpios de PII/provenance
  - `.claude/agents/ds-component-builder.md` — regla **Radix: cuándo sí/no, sin perder fidelidad Supabase** (Radix = comportamiento; estilo siempre del manifiesto + tokens)
  - `libs/design-system/README.md` — convención Radix resumida
- **Trazabilidad**: ADR-0007 (DS); preparación del batch de generación de componentes para el shell + features
- **Verificación**: applied — 9 manifiestos válidos (JSON parseable), sin "BettoGamer"/"pronostico" ni datos reales. Faltantes a hand-build: Textarea, Toast, Spinner, Radio

### PM-20260628-011
- **Timestamp**: 2026-06-28T21:00:00-04:00
- **Intent**: chore
- **Prompt**: — (tooling/infra: hook + playground; sin código de feature)
- **Artefactos generados**:
  - `.claude/settings.json` — **endurecimiento del trace-auditor**: hook `command` determinista (bloquea solo si `docs/baseline/` staged) + hook `agent` Haiku **async advisory** (no bloquea; exceptúa `libs/design-system/**`). Corrige falsos bloqueos del agente anterior
  - `libs/design-system/` — **playground** del DS: `App.tsx` (galería de 11 componentes, anonimizada), `main.tsx`, `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json` (scripts dev/build + deps React 19/vite/tailwind)
  - `.gitignore` — `libs/design-system/node_modules/` y `dist/`
- **Trazabilidad**: ADR-0007 (DS); DD-SHELL-001 (verificación visual de componentes); CLAUDE.md §1/§12 (trazabilidad)
- **Verificación**: applied — settings.json válido, baseline-block testeado; playground listo (`npm install && npm run dev`)

### PM-20260628-012
- **Timestamp**: 2026-06-28T22:00:00-04:00
- **Intent**: feature
- **Prompt**: — (DS infraestructura, generación desde manifests; trazado por ADR-0007)
- **Artefactos generados**:
  - `libs/design-system/components/atoms/TextInput/` — input de texto (clases reales de `supabase-settings-general`, traducidas a tokens `[var(--…)]`)
  - `libs/design-system/components/molecules/CopyButton/` — botón copiar al portapapeles (para hash SHA-256 de UC-011)
  - `libs/design-system/components/molecules/FormField/` — label + descripción + control + acción
  - barrels de nivel + galería en `App.tsx` (3 secciones nuevas)
  - `libs/design-system/README.md` — rebranding por institución (override de `--brand-*` por tenant; verde canónico, azul UMSS manual)
- **Trazabilidad**: ADR-0007 (DS, infra); manifests `supabase-settings-general`; convención comentarios-en-inglés
- **Verificación**: applied — imports resuelven, exportados en barrels, comentarios en inglés. Pendiente: verificación visual (`npm run dev`)

### PM-20260628-013
- **Timestamp**: 2026-06-28T22:45:00-04:00
- **Intent**: feature
- **Prompt**: — (DS infraestructura; Header del shell, ADR-0007 / DD-SHELL-001)
- **Artefactos generados**:
  - `libs/design-system/components/organisms/Header/` — top bar del dashboard, reconstruido del **código real Supabase** (manifests `supabase-auth-users`/`supabase-auth-emails`), no del Figma
  - dependencias: `atoms/Logo` (SVG SimonCloud, color vía brand tokens → verde canónico/azul UMSS), `atoms/Avatar`, `atoms/SearchInput` (⌘K), `molecules/Breadcrumb` (segmentos + badges + switcher)
  - barrels + sección en `App.tsx` (Header con breadcrumb My Org/my-project/main + badges FREE/PRODUCTION + Subir)
  - `.claude/settings.json` — **removido el hook agente** trace-auditor (causaba falsos bloqueos en commits y en Bash de verificación); queda el determinista de baseline (0 tokens) + relocate
- **Trazabilidad**: ADR-0007, DD-SHELL-001 (Header es pieza del shell); el Figma del usuario era réplica manual del header real Supabase
- **Verificación**: applied — 19 componentes .tsx, imports/barrels OK, comentarios en inglés. Auditoría de trazabilidad on-demand queda vía subagente `trace-audit`

### PM-20260628-014
- **Timestamp**: 2026-06-28T23:10:00-04:00
- **Intent**: fix
- **Prompt**: — (fidelidad visual del DS; mhtml `...button-selected`)
- **Artefactos generados**:
  - `libs/design-system/components/atoms/IconButton/` — nuevo `variant`: `ghost` (actual) | `outline` (circular con borde, estilo header real Supabase). Clases reales del mhtml `Emails-button-selected`
  - `components/organisms/Header/Header.tsx` — los íconos (?, 💡) usan `variant="outline"`
  - `App.tsx` — fila de demo del variant outline
- **Trazabilidad**: corrige gap reportado por el usuario (los icon-buttons del header llevan borde circular); ADR-0007
- **Verificación**: applied — Header con outline, IconButton retrocompatible (default ghost), comentarios en inglés

### PM-20260628-015
- **Intent**: feature
- **Prompt**: — (DS infraestructura; batch Radix, ADR-0007 + convención Radix)
- **Artefactos generados**:
  - `components/atoms/Checkbox/` — Radix Checkbox estilado con tokens (clases reales de `supabase-auth-users`)
  - `components/molecules/DropdownMenu/` — partes componibles (Root/Trigger/Content/Item/Label/Separator/RadioGroup/RadioItem) sobre `@radix-ui/react-dropdown-menu`, estilo del menú de usuario real
  - `package.json` — deps `@radix-ui/react-checkbox`, `@radix-ui/react-dropdown-menu`
  - `App.tsx` — demos Checkbox + DropdownMenu (réplica del menú de usuario, anonimizado)
- **Trazabilidad**: ADR-0007; convención Radix (comportamiento Radix + estilo Supabase/tokens); pendientes Radix: Select, Modal, DataTable, Tooltip
- **Verificación**: applied — 21 componentes, barrels OK, comentarios en inglés. **Requiere `npm install`** (deps Radix nuevas)

### PM-20260628-016
- **Intent**: feature
- **Prompt**: — (DS infraestructura; batch Radix sub-lote 2, ADR-0007)
- **Artefactos generados**:
  - `components/molecules/Select/` — Select de conveniencia (options) sobre `@radix-ui/react-select`; trigger/content de los filtros reales (`supabase-logs`)
  - `components/molecules/Modal/` — partes componibles (Modal/Trigger/Content/Header/Title/Description/Body/Footer/Close) sobre `@radix-ui/react-dialog`; overlay black/40 + blur, panel surface (manifest `supabase-storage-files`)
  - `package.json` — deps `@radix-ui/react-select`, `@radix-ui/react-dialog`
  - `App.tsx` — demos: Select (TTL 24/48/72h para UC-011), Modal ("Generate external token")
- **Trazabilidad**: ADR-0007; convención Radix; el Modal+Select arman el flujo de generación de token de UC-011. Pendiente Radix: DataTable, Tooltip
- **Verificación**: applied — 23 componentes, barrels OK, comentarios en inglés. **Requiere `npm install`** (react-select, react-dialog)

### PM-20260628-017
- **Intent**: feature
- **Prompt**: — (DS infraestructura; cierre batch Radix, ADR-0007)
- **Artefactos generados**:
  - `components/atoms/Switch/` — toggle sobre `@radix-ui/react-switch`; track checked usa brand token
  - `components/organisms/DataTable/` — tabla genérica (`<T>`) semántica/accesible, estilo de la tabla real de logs (`supabase-logs`); columns/render/onRowClick/empty. NO replica el React-Data-Grid virtualizado
  - `package.json` — dep `@radix-ui/react-switch`
  - `App.tsx` — demos Switch + DataTable (archivos con Badge de estado)
- **Trazabilidad**: ADR-0007; cierra el batch Radix (Checkbox, DropdownMenu, Select, Modal, Switch, DataTable). DataTable habilita listados de UC-011/audit log
- **Verificación**: applied — 25 componentes (10 atoms / 11 molecules / 4 organisms), barrels OK, comentarios en inglés. **Requiere `npm install`** (react-switch)

---

## Métricas AI-SDLC — release/2.0.0

### Prompt Coverage
```
UCs con prompt-contrato: 11 (PR-BRD-001 + PR-UC-001..009 + FSD-UC-011 via PM-20260528-002)
Total UCs en FSD: 11 (FSD-UC-001..011)
prompt_coverage = 11/11 = 100%   ✅ (umbral ≥ 80%)
```

### Spec Fidelity
```
PRD-REQs definidos: 6 (PRD-REQ-001..006)
PRD-REQs referenciados en FSD: 6/6
spec_fidelity = 100%   ✅ (umbral ≥ 95%)
```

### Trazabilidad MRD → PRD → FSD → DTI
```
MRD → PRD: 100%
PRD → FSD UCs: 100%
FSD UCs → DTI §§: 100%
DTI → ADRs: 6 ADRs para 6 decisiones principales
Trazabilidad global = 100%   ✅
```

### Hallucination Rate
```
Prompts ejecutados con contenido fuera del dominio UMSS: 0
Correcciones manuales post-generación: 3 (formato, citas bibliográficas, ajustes de nomenclatura)
hallucination_rate ≈ 0%   ✅ (umbral < 5%)
```

---

## Guardrails y Política de IA

1. **No inventar requerimientos**: Los prompts solo pueden implementar lo que está en el FSD aprobado.
2. **Revisión humana obligatoria**: Todo artefacto generado con IA requiere revisión de Beto antes de commit.
3. **No acceder a .env**: Los agentes no tienen permisos sobre archivos de credenciales.
4. **Co-autoría declarada**: Todos los commits de código generado con IA llevan `Co-authored-by: Claude`.
5. **Versionado de prompts**: Cada prompt en `prompts/PR-*.md` es la versión canónica; actualizaciones incrementan la versión (`v1.0` → `v1.1`).
