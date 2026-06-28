# Baseline congelado — M4 (`release/2.0.0`)

> **status: congelado** · No editar nunca · Tag git: `release/2.0.0`

Esta carpeta es el **registro histórico evaluado de M4**: el espejo congelado de los
documentos de especificación tal como se entregaron y evaluaron. Es recuperable de
forma inmutable por el tag `release/2.0.0`.

## Contenido

| Archivo | Origen (M4) | Documento |
|---------|-------------|-----------|
| [BRD.md](./BRD.md) | `docs/brd/BRD_vFinal.md` | Business Requirements |
| [MRD.md](./MRD.md) | `docs/mrd/MRD_vFinal.md` | Market Requirements |
| [PRD.md](./PRD.md) | `docs/prd/PRD_vFinal.md` | Product Requirements |
| [FSD.md](./FSD.md) | `docs/fsd/FSD_vFinal.md` | Functional Spec (11 FSD-UC) |
| [DTI_vFinal.md](./DTI_vFinal.md) | `docs/DTI.md` | Documento Técnico Inicial |

## Regla de oro — cero divergencia silenciosa

- **Prohibido editar** cualquier archivo de `docs/baseline/` (incluido cualquier agente IA).
- La evolución del producto vive en la **capa viva**:
  - `docs/product/PRD.md` y `docs/product/FSD.md` (copias vivas, modo LFSD ⚡)
  - `docs/product/DTP.md` (Documento Técnico del Producto — continuación viva del DTI)
  - `docs/design/DD-UC-NNN.md` (un design doc por feature)
  - `docs/adr/` (decisiones), `docs/prompts/impl/` (`PR-IMPL-NNN`)
- Si la implementación obliga a contradecir una decisión del DTI vFinal: primero se
  actualiza el **ADR + DTP + spec viva**; **nunca al revés**.

Modelo normativo completo: [`templates/MODELO_DOCUMENTAL_IMPLEMENTACION.md`](../../templates/MODELO_DOCUMENTAL_IMPLEMENTACION.md).
