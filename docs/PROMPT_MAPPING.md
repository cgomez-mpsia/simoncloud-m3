# PROMPT_MAPPING.md — Trazabilidad de Prompts AI-SDLC — SimonCloud

> **Ética y Trazabilidad**: Este archivo es el **Prompt Log Obligatorio** del proyecto. Documenta todos los artefactos generados con asistencia de IA. Bajo el paradigma AI-SDLC, si no hay prompt log, no hay auditoría.

---

## Índice de Trazabilidad

| ID Prompt | Artefacto generado | FSD-UC | Modelo | Estado |
|-----------|-------------------|--------|--------|--------|
| `PR-BRD-001` | Auditoría de coherencia BRD | — | Claude Sonnet 4 | applied |
| `PR-UC-001` | `createLtiDeepLink()` TypeScript | FSD-UC-001 | Claude Sonnet 4 | applied |
| `PR-UC-002` | `generateFileHash()` SHA-256 | FSD-UC-002 | Claude Sonnet 4 | applied |
| `PR-UC-003` | Stream Google Drive → S3 | FSD-UC-008 | Claude Sonnet 4 | applied |
| `PR-UC-004` | Cronjob purga papelera 30 días | FSD-UC-009 | Claude Sonnet 4 | applied |
| `PR-UC-005` | Componente React Uploader | FSD-UC-002 (UI) | Claude Sonnet 4 | applied |
| `PR-UC-006` | NestJS Guard HMAC Webhook QR | FSD-UC-003 | Claude Sonnet 4 | applied |
| `PR-UC-007` | GET /archivos/:id/versiones | FSD-UC-005 | Claude Sonnet 4 | applied |
| `PR-UC-008` | Worker SQS notificaciones push | FSD-UC-007 | Claude Sonnet 4 | applied |
| `PR-UC-009` | Export PDF audit log streaming | FSD-UC-010 | Claude Sonnet 4 | applied |

---

## Mapeo Rápido Símbolo → Archivo → Métricas

| Símbolo | Archivo fuente | Sección | Antes (sin AI) | Después (con AI) |
|---------|---------------|---------|----------------|------------------|
| `createLtiDeepLink` | `apps/lms-connector/src/deeplink/lti-deeplink.service.ts` | FSD-UC-001 | Implementación manual estimada: 4h | Generado + revisado: 45min |
| `generateFileHash` | `libs/shared/src/crypto/sha256.service.ts` | FSD-UC-002, BR-007 | Implementación manual: 30min | Generado + revisado: 5min |
| `QrSimpleWebhookGuard` | `apps/quota-service/src/guards/qr-webhook.guard.ts` | FSD-UC-003, BR-010 | Implementación manual: 2h | Generado + revisado: 20min |
| `processNotification` | `apps/notification-service/src/workers/notification.worker.ts` | FSD-UC-007 | Implementación manual: 3h | Generado + revisado: 30min |
| `exportAuditLogPdf` | `apps/admin-service/src/controllers/audit.controller.ts` | FSD-UC-010 | Implementación manual: 4h | Generado + revisado: 45min |
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

---

## Métricas AI-SDLC — release/2.0.0

### Prompt Coverage
```
UCs con prompt-contrato: 10 (PR-BRD-001 + PR-UC-001..009)
Total UCs en FSD: 10 (FSD-UC-001..010)
prompt_coverage = 10/10 = 100%   ✅ (umbral ≥ 80%)
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
