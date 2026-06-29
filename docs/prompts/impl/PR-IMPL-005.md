# PR-IMPL-005 — Slice de creación de SimonDrop simplificada (FSD-UC-001)

## 0. Metadatos del prompt

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-IMPL-005` |
| Título | Creación de SimonDrop simplificada (sin LTI) — habilitante del E2E |
| Artefacto origen | Design Doc + ADR |
| ID origen | `FSD-UC-001`, `DD-UC-001`, `ADR-0008`, `ADR-0006` |
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
Eres un Senior Backend Engineer experto en NestJS 10, TypeScript estricto, Prisma 5 y
arquitectura hexagonal.
```

### 1.2 Task
```text
Implementa la creación de SimonDrop simplificada según docs/design/DD-UC-001.md: entidad
SimonDrop, CreateSimonDropUseCase y ListMySimonDropsUseCase, DropRepositoryPort→Prisma y
DropController (POST/GET /api/drops). SIN LTI. Incluye tests Jest con cobertura ≥90%.
```

### 1.3 Context
```text
- Documento fuente: docs/design/DD-UC-001.md; FSD-UC-001; ADR-0008 (sin LTI en v1), ADR-0006.
- Entidad SimonDrop: id (UUID v4), titulo, ownerId, estado ABIERTO|CERRADO, fechaCierre?, createdAt.
- Reglas: solo rol DOCENTE crea; PK UUID v4 (no autoincrement); estado por defecto ABIERTO.
- Restricciones técnicas: NestJS 10, Prisma 5/PostgreSQL 16, hexagonal (domain sin Prisma;
  DropRepositoryPort en domain/port/out/). Protegido por JwtAuthGuard (PR-IMPL-004).
```

### 1.4 Reasoning
```text
1. Migración Prisma: tabla simondrop (id uuid pk, titulo, ownerId, estado, fechaCierre?, createdAt).
2. domain/: SimonDrop (entidad) + regla "solo DOCENTE crea". domain/port/out/DropRepositoryPort.
3. application/: CreateSimonDropUseCase, ListMySimonDropsUseCase.
4. adapter/out/: PgDropRepository (Prisma). adapter/in/: DropController (POST /api/drops, GET /api/drops).
5. Tests: solo DOCENTE crea (403 otros), UUID v4, estado default ABIERTO, listar solo los propios.
No expongas el razonamiento en el output final.
```

### 1.5 Stop condition
```text
Detente cuando compila (npx tsc + npx prisma validate), npm test pasa con cobertura ≥90% del
slice, o falta información del DD-UC-001 (pedir aclaración, no inventar).
```

### 1.6 Output
```text
Archivos del slice drop + migración Prisma + specs Jest. Resumen generado vs editado a mano y % cobertura.
```

## 2. Invariantes
- Hexagonal: `domain/` no importa Prisma; puerto en `domain/port/out/`.
- PK **UUID v4** (invariante de dominio); nunca autoincrement.
- Solo `DOCENTE` crea (RBAC, BR-006).
- Estado por defecto `ABIERTO`.
- Cobertura del slice **≥90%**.
- Cita IDs origen (`FSD-UC-001`, `DD-UC-001`).

## 3. Failure modes declarados
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_MISSING_CONTEXT` | falta DD-UC-001 | abortar |
| `E_POLICY_VIOLATION` | permite crear a no-DOCENTE o PK autoincrement | rechazar y reintentar |

## 4. Guardrails
- **MUST**: tests verdes y cobertura ≥90% antes de proponer PR.
- **MUST**: registrar la ejecución en `docs/PROMPT_MAPPING.md`.
- **MUST NOT**: implementar LTI (diferido, ADR-0006); **MUST NOT**: tocar `docs/baseline/`.

## 5. Trazabilidad
| Origen | ID origen | Este prompt | Consumidor | Artefacto |
|--------|-----------|-------------|------------|-----------|
| FSD + DD + ADR | `FSD-UC-001`, `DD-UC-001`, `ADR-0008` | `PR-IMPL-005` | dev-agent | `src/drops/**`, `tests/drops/**`, migración `simondrop` |

## 6. Pruebas del prompt
- **Feliz**: DOCENTE crea drop → UUID v4 + estado ABIERTO; GET lista solo los suyos.
- **Borde**: drop con `fechaCierre` pasada → marcado CERRADO (no admite subida en UC-002).
- **Adversarial**: ESTUDIANTE intenta crear → 403.

## 9. Revisión humana
| Revisor | Fecha | Veredicto | Notas |
|---------|-------|-----------|-------|
| Carlos A. Gomez | — | pendiente | Ejecutar tras PR-IMPL-004 (auth) |
