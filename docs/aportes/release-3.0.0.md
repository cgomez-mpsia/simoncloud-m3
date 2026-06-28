# Aportes Individuales — release/3.0.0

> **Proyecto**: SimonCloud — Almacenamiento Institucional UMSS
> **Release**: `release/3.0.0` (capa viva — implementación)
> **Período**: Junio 2026 —
> **Módulo**: 5 — Implementación asistida por IA (AI-SDLC)
> **Fecha de corte**: 2026-06-28 (sprint en curso)
> **Consigna**: cada integrante desarrolla 1 funcionalidad con demo, diseño-primero, trazabilidad y cobertura ≥90% (docente, 19/06/2026).

---

## §1. Integrantes del Grupo

| Nombre | Correo | Rol |
|--------|--------|-----|
| Carlos Alberto Gomez Ormachea | carlos@brilliant.tech | Arquitecto / Desarrollador / Documentador (único integrante, G01) |

---

## §2. Tabla de Tareas por Integrante (sprint actual)

| ID Tarea | Descripción | Integrante | Artefacto resultante | Estado |
|----------|-------------|-----------|---------------------|--------|
| T-M5-001 | Transición documental M4→implementación (baseline congelado + capa viva) | Carlos | `docs/baseline/`, `docs/product/`, tag `release/2.0.0` | ✅ |
| T-M5-002 | DTP v1.0 (Documento Técnico del Producto, continuación viva del DTI) | Carlos | `docs/product/DTP.md` | ✅ |
| T-M5-003 | Regla de cobertura ≥90% + protección del baseline | Carlos | `AGENTS.md`, `CLAUDE.md §12`, `.github/CODEOWNERS` | ✅ |
| T-M5-004 | Skills de apoyo `feature-design-doc` y `dtp-sync` | Carlos | `.claude/commands/feature-design-doc.md`, `dtp-sync.md` | ✅ |
| T-M5-005 | **Feature del demo**: Design Doc de acceso externo con token HMAC | Carlos | `docs/design/DD-UC-011.md` | ✅ |
| T-M5-006 | Prompt-contrato de implementación de UC-011 | Carlos | `docs/prompts/impl/PR-IMPL-001.md` | ✅ |
| T-M5-007 | Implementación del slice UC-011 (código NestJS) | Carlos | `src/external/**` | ⏳ pendiente |
| T-M5-008 | Tests del slice UC-011 con cobertura ≥90% | Carlos | `tests/external/**` | ⏳ pendiente |
| T-M5-009 | Sincronización DTP + specs vivas tras implementar (`/dtp-sync`) | Carlos | `docs/product/DTP.md §A` | ⏳ pendiente |
| T-M5-010 | Demo grabado de la funcionalidad | Carlos | video | ⏳ pendiente |

---

## §3. Feature desarrollado (demo)

- **Funcionalidad**: Acceso de usuario externo con token temporal HMAC-SHA256 (`FSD-UC-011`).
- **Cadena de trazabilidad**: `FSD-UC-011` → `DD-UC-011` → `PR-IMPL-001` → (código) → (tests ≥90%) → DTP.
- **Decisión de arquitectura**: ya resuelta en DTI vFinal §3 (token stateful HMAC); no requirió ADR nuevo (criterio registrado en `DD-UC-011 §3`).
