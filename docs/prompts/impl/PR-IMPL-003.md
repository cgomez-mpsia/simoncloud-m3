# PR-IMPL-003 — Slice de subida segura + comprobante SHA-256 (FSD-UC-002)

## 0. Metadatos del prompt

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-IMPL-003` |
| Título | Subida (presigned PUT a MinIO) + comprobante SHA-256 + inmutabilidad |
| Artefacto origen | Design Doc + ADR |
| ID origen | `FSD-UC-002`, `DD-UC-002`, `ADR-0008`, `ADR-0003` |
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
@aws-sdk/client-s3 (MinIO), criptografía (SHA-256) y arquitectura hexagonal.
```

### 1.2 Task
```text
Implementa la subida segura de un archivo según docs/design/DD-UC-002.md: presigned PUT a
MinIO, cálculo/verificación de SHA-256 en servidor, inmutabilidad (Object Lock + solo_lectura)
y registro en BD. Subida en UNA operación (sin reanudación en v1). Tests Jest cobertura ≥90%.
```

### 1.3 Context
```text
- Documento fuente: docs/design/DD-UC-002.md; FSD-UC-002; ADR-0008 (v1 sin reanudación), ADR-0003.
- Flujo: POST /api/drops/:id/files/presign -> { uploadUrl, objectKey }; el cliente sube a MinIO;
  POST /api/drops/:id/files/confirm { objectKey } -> el servidor streamea el objeto, calcula
  SHA-256 (fuente de verdad = servidor), marca Object Lock + solo_lectura, persiste y retorna comprobante.
- Restricciones de dominio: BR-007 (SHA-256 string 64-hex lowercase), BR-005 (inmutabilidad);
  solo se sube si el drop está ABIERTO (UC-001).
- Restricciones técnicas: NestJS 10, Prisma 5/PostgreSQL 16, @aws-sdk/client-s3 → MinIO,
  hexagonal (FileStoragePort, FileRepositoryPort en domain/port/out/). Protegido por JwtAuthGuard.
```

### 1.4 Reasoning
```text
1. Migración Prisma: tabla archivo (id uuid, simondropId fk, fileName, sha256, sizeBytes,
   solo_lectura bool, uploadedAt).
2. domain/: Archivo (entidad) + SHA256Hash (VO existente) + reglas BR-005/BR-007.
   domain/port/out/: FileStoragePort (presign, getObject, setObjectLock), FileRepositoryPort.
3. application/: RequestUploadUseCase (presign), ConfirmUploadUseCase (hash + lock + persist).
4. adapter/out/: S3FileStorage (MinIO presign/get/lock), PgFileRepository (Prisma).
5. adapter/in/: FileController (presign, confirm). Validar drop ABIERTO + rol.
6. Tests: SHA256Hash (64-hex), ConfirmUploadUseCase con ports mockeados, solo_lectura no re-escribible,
   rechazo si drop CERRADO; integración con MinIO+BD efímeros.
No expongas el razonamiento en el output final.
```

### 1.5 Stop condition
```text
Detente cuando compila (npx tsc + npx prisma validate), npm test pasa con cobertura ≥90% del
slice, o falta información del DD-UC-002 (pedir aclaración, no inventar).
```

### 1.6 Output
```text
Archivos del slice file + migración Prisma + specs Jest. Resumen generado vs editado a mano y % cobertura.
```

## 2. Invariantes
- Hexagonal: `domain/` no importa Prisma/MinIO; puertos en `domain/port/out/`.
- **SHA-256 autoritativo en el servidor** (no se confía en el cliente); string 64-hex lowercase (BR-007).
- Inmutabilidad: `solo_lectura=true` + Object Lock; no se permite re-subir/editar (BR-005).
- Subida en una sola operación (sin chunks en v1); reanudación diferida (ADR-0003).
- Secretos MinIO desde env/Vault, **nunca hardcoded**.
- Cobertura del slice **≥90%**. Cita IDs origen (`FSD-UC-002`, `DD-UC-002`).

## 3. Failure modes declarados
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_MISSING_CONTEXT` | falta DD-UC-002 | abortar |
| `E_POLICY_VIOLATION` | confía en hash del cliente, hardcodea secreto, o permite editar inmutable | rechazar y reintentar |
| `E_AMBIGUOUS_INPUT` | contradicción FSD/DD | pedir aclaración |

## 4. Guardrails
- **MUST**: tests verdes y cobertura ≥90% antes de proponer PR.
- **MUST**: registrar la ejecución en `docs/PROMPT_MAPPING.md`.
- **MUST NOT**: implementar reanudación por chunks (diferido); **MUST NOT**: tocar `docs/baseline/`.

## 5. Trazabilidad
| Origen | ID origen | Este prompt | Consumidor | Artefacto |
|--------|-----------|-------------|------------|-----------|
| FSD + DD + ADR | `FSD-UC-002`, `DD-UC-002`, `ADR-0008` | `PR-IMPL-003` | dev-agent | `src/file/**`, `tests/file/**`, migración `archivo` |

## 6. Pruebas del prompt
- **Feliz**: presign → PUT → confirm → SHA-256 64-hex + solo_lectura=true + fila en BD + Object Lock.
- **Borde**: archivo de 0 bytes / nombre con caracteres especiales.
- **Adversarial**: confirmar con hash de cliente falso → el servidor recalcula y manda el real; re-subir a archivo inmutable → rechazo.

## 9. Revisión humana
| Revisor | Fecha | Veredicto | Notas |
|---------|-------|-----------|-------|
| Carlos A. Gomez | — | pendiente | Ejecutar tras PR-IMPL-005 (drop) |
