# PR-IMPL-001 — Slice NestJS de acceso externo con token HMAC (FSD-UC-011)

## 0. Metadatos del prompt

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-IMPL-001` |
| Título | Implementación del vertical slice de UC-011 (token externo HMAC-SHA256) |
| Artefacto origen | FSD + Design Doc |
| ID origen | `FSD-UC-011`, `DD-UC-011` |
| Tipo de prompt | generación (código + tests) |
| Modelo recomendado | Opus / Sonnet |
| Temperatura | 0.1 |
| Versión | v0.1 |
| Fecha | 28/06/2026 |
| Autor(es) | Carlos Alberto Gomez Ormachea |
| Estado | Borrador (no ejecutado — diseño primero) |

## 1. Anatomía del prompt

### 1.1 Role
```text
Eres un Senior Backend Engineer experto en NestJS 10, TypeScript estricto, Prisma 5,
arquitectura hexagonal y seguridad de APIs. Implementas un vertical slice completo y
testeado.
```

### 1.2 Task
```text
Implementa FSD-UC-011 según docs/design/DD-UC-011.md: generación de token externo
(POST /api/drops/:id/external-token, JWT) y consumo público (GET /external/drops/:id/
archivos?token=, sin JWT) con ExternalTokenGuard HMAC-SHA256, URL presignada MinIO
(TTL 5 min) y registro en audit_log. Incluye tests Jest con cobertura ≥90%.
```

### 1.3 Context
```text
- Documento fuente: docs/design/DD-UC-011.md y docs/product/FSD.md §4.11.
- Decisión de arquitectura: DTI vFinal §3 (coexistencia JWT+HMAC, token stateful en
  tabla tokens_externos). No reabrir esta decisión.
- Restricciones de dominio: BR-011 (HMAC-SHA256, TTL ≤ 72h, 403 sin revelar recurso si
  inválido/expirado), SHA-256 como string 64-hex lowercase, audit_log obligatorio.
- Restricciones técnicas: NestJS 10, Prisma 5/PostgreSQL 16, @aws-sdk/client-s3 → MinIO,
  secreto HMAC desde Vault/Docker Secret (NUNCA hardcoded). Hexagonal: domain no importa
  infra; ports en domain/port/out/.
```

### 1.4 Reasoning
```text
1. Migración Prisma: tabla tokens_externos (id, dropId, hmac, expiresAt, createdBy,
   revokedAt?) y audit_log (tokenId, dropId, archivoId, ip, userAgent, accessedAt, outcome).
2. Dominio: ExternalToken (creación + verificación HMAC + expiración), puertos
   TokenRepositoryPort, FileStoragePort, AuditLogPort.
3. Aplicación: GenerateExternalTokenUseCase, ResolveExternalAccessUseCase.
4. Adapters in: ExternalTokenController (JWT), ExternalAccessController (/external, sin JWT),
   ExternalTokenGuard.
5. Adapters out: Prisma repos + MinIO presign.
6. Tests: unit (dominio + use cases con mocks) e integración; cubrir los 3 Gherkin de UC-011.
No expongas el razonamiento interno en el output final.
```

### 1.5 Stop condition
```text
Detente cuando:
- El slice compila (npx tsc) y npm test pasa con cobertura ≥90% del slice, o
- Falta información del DD-UC-011/FSD y debes pedir aclaración (no inventes).
```

### 1.6 Output
```text
Formato: archivos de código TypeScript + migración Prisma + specs Jest, en las rutas
del slice. Más un resumen de archivos generados vs editados a mano y el % de cobertura.
```

## 2. Invariantes
- La salida respeta hexagonal: `domain/` no importa Prisma/MinIO/NestJS.
- HMAC-SHA256; token inválido/expirado → **403 sin filtrar** nombre ni existencia del recurso (BR-011).
- SHA-256 siempre `string` 64-hex lowercase.
- Secreto HMAC leído de Vault/Docker Secret; **nunca** hardcoded ni en logs.
- Cobertura del slice **≥90%**.
- Cita los IDs origen (`FSD-UC-011`, `DD-UC-011`) en el PR.

## 3. Failure modes declarados

| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_MISSING_CONTEXT` | falta DD-UC-011 o FSD-UC-011 | abortar |
| `E_AMBIGUOUS_INPUT` | contradicción entre FSD y DD | pedir aclaración |
| `E_POLICY_VIOLATION` | output filtra recurso ante token inválido o hardcodea secreto | rechazar y reintentar |

## 4. Guardrails
- **MUST**: tests verdes y cobertura ≥90% antes de proponer PR.
- **MUST**: registrar la ejecución en `docs/PROMPT_MAPPING.md`.
- **MUST NOT**: exponer secretos; **MUST NOT**: tocar `docs/baseline/`.

## 5. Trazabilidad

| Origen | ID origen | Este prompt | Consumidor | Artefacto generado |
|--------|-----------|-------------|------------|---------------------|
| FSD + DD | `FSD-UC-011`, `DD-UC-011` | `PR-IMPL-001` | dev-agent | `src/external/**`, `tests/external/**`, migración `tokens_externos` |

## 6. Pruebas del prompt
- **Feliz**: token válido → 200 con `{fileName, sha256, downloadUrl}` + fila en `audit_log`.
- **Borde**: token a 1s de expirar vs expirado hace 1s (límite 72h).
- **Adversarial**: HMAC manipulado → 403 sin leak + `E_POLICY_VIOLATION` si filtra algo.

## 9. Revisión humana

| Revisor | Fecha | Veredicto | Notas |
|---------|-------|-----------|-------|
| Carlos A. Gomez | — | pendiente | Ejecutar tras aprobar DD-UC-011 |
