# Design Docs por feature (`DD-UC-NNN`)

Un design doc por feature (vertical slice), trazable a su `FSD-UC`. Describe el
**cómo** se construye. Plantilla: [`templates/FEATURE_DESIGN_DOC_TEMPLATE.md`](../../templates/FEATURE_DESIGN_DOC_TEMPLATE.md).

| ID | FSD-UC | Título | Estado |
|----|--------|--------|--------|
| `DD-UC-004` | FSD-UC-004 | Auth habilitante (stub WebSISS + JWT real) | borrador |
| `DD-UC-001` | FSD-UC-001 | Creación de SimonDrop simplificada (sin LTI) | borrador |
| `DD-UC-002` | FSD-UC-002 | Subida segura de archivo + comprobante SHA-256 (tramo 1 del E2E) | borrador |
| `DD-UC-011` | FSD-UC-011 | Acceso de usuario externo con token temporal (tramo 2 del E2E) | en redacción |
| `DD-SHELL-001` | (transversal) | App shell: layout + routing + theme + design system | borrador |

> **Feature E2E oficial** (ADR-0008): `DD-UC-004 → DD-UC-001 → DD-UC-002 → DD-UC-011`.
> PR-IMPL: 004 (auth) · 005 (drop) · 003 (subida) · 001 (token).
