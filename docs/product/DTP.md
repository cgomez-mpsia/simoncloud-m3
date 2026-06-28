---
producto: "SimonCloud — Almacenamiento Institucional UMSS"
grupo: "G01"
documento: DTP                 # Documento Técnico del Producto (continuación VIVA del DTI)
version: v1.0                  # versiona la implementación, no el diseño de M4
fecha: "28/06/2026"
status: vivo                   # vivo | en_revision | publicado-release   (NUNCA "congelado")
audiencia: dual               # humanos + agentes IA
baseline_ref:                 # el baseline CONGELADO del que parte este DTP (M4)
  dti: "docs/baseline/DTI_vFinal.md"
  tag: "release/2.0.0"
  commit: "db4916fd"
release: "release/3.0.0"      # release vivo que este DTP describe
stack:
  - "NestJS 10 + TypeScript strict"
  - "Prisma 5 + PostgreSQL 16"
  - "Redis 7 Cluster · RabbitMQ (topic) · MinIO (S3-compatible, WORM)"
  - "React 18 + Vite + Tailwind"
repo: "simoncloud-m3"
agents_md: "/AGENTS.md"
artefactos_vivos:
  prd: "docs/product/PRD.md"
  fsd: "docs/product/FSD.md"
  prompt_mapping: "docs/PROMPT_MAPPING.md"
  design_docs_dir: "docs/design/"
  adr_dir: "docs/adr/"
---

# Documento Técnico del Producto (DTP) — SimonCloud

> **Qué es**: el DTP es la **continuación viva del DTI**. El DTI vFinal fue "el plano"
> (foto técnica congelada al cierre de M4, `release/2.0.0`); el DTP es "el DTI que
> compila": el **contrato técnico vigente** mientras se implementa.
>
> **Regla de oro — cero divergencia silenciosa**: si el código necesita contradecir
> una decisión del DTI vFinal, primero se actualiza el ADR + el DTP + la spec viva;
> **nunca al revés**.
>
> **Qué NO es**: el DTP **no reescribe** el baseline congelado (`docs/baseline/`,
> recuperable por el tag `release/2.0.0`). El baseline permanece intacto.

## Cómo se origina

1. Se copia el **DTI vFinal** (`docs/baseline/DTI_vFinal.md`) como punto de partida.
2. Todo cambio técnico entra por el control de cambios (§A).
3. El baseline de M4 queda inmutable en `docs/baseline/` + tag `release/2.0.0`.

```mermaid
flowchart LR
  DTI["DTI vFinal (congelado, release/2.0.0)"] -->|copia inicial| DTP["DTP v1.0 (vivo)"]
  FSDv["FSD vivo (LFSD, FSD-UC-NNN)"] --> DD["Design Doc (DD-UC-NNN)"]
  DD --> Code["PR / codigo"]
  Code --> DTP
  ADR["ADR (si hay decision)"] --> DTP
```

---

## A. Control de cambios (núcleo del DTP) `[humano+máquina]`

### A.1 Changelog de implementación

| Fecha | Cambio | Disparador (FSD-UC / DD / hallazgo) | ADR | PR / commit | Autor |
|-------|--------|-------------------------------------|-----|-------------|-------|
| 28/06/2026 | Transición M4→implementación: baseline congelado + capa viva (`docs/product`, `docs/design`, `docs/prompts/impl`) + DTP v1.0 | Modelo documental M4 | — | _(pendiente commit)_ | Carlos A. Gomez |

### A.2 Deltas respecto al DTI vFinal

> Diferencias **deliberadas** entre lo diseñado en M4 y lo construido. Cada delta
> significativo exige un ADR.

| # | Sección del DTI afectada | Qué decía el DTI vFinal | Qué dice ahora el DTP | Motivo | ADR |
|---|--------------------------|-------------------------|-----------------------|--------|-----|
| — | _(sin deltas todavía)_ | | | | |

### A.3 Estado de implementación por FSD-UC

| FSD-UC | Design Doc | Estado | Release | Tests/Evals | Notas |
|--------|------------|--------|---------|-------------|-------|
| `FSD-UC-011` Acceso usuario externo (token HMAC) | `DD-UC-011` _(en redacción)_ | en curso | `release/3.0.0` | objetivo ≥90% | Feature del demo (G01). Diseño primero, luego código. |
| `FSD-UC-002` Subida + hash (POC-03) | — | poc | `release/2.0.0` | parcial | Construido como POC en M4. |
| `FSD-UC-001` Creación SimonDrop (POC-03) | — | poc | `release/2.0.0` | parcial | Construido como POC en M4. |
| `FSD-UC-004` SSO WebSISS (POC-03) | — | poc | `release/2.0.0` | parcial | Mock SSO en POC. |

### A.4 Trazabilidad código ↔ DTP

`BRD/MRD (baseline)` → `PRD/FSD vivo (FSD-UC-NNN)` → `Design Doc (DD-UC-NNN)` →
`Prompt (PR-IMPL-NNN)` → `PR/commit` → `Tests/Evals` → `ADR (si aplica)` → **DTP**.

---

## B. Contenido técnico vigente `[humano+máquina]`

> El DTP mantiene al día las mismas secciones que el DTI. Si una sección **no cambió**
> respecto al DTI vFinal, se referencia; si **cambió**, se reescribe aquí y se registra
> el delta en §A.2.

| Sección (espejo del DTI) | ¿Cambió vs DTI vFinal? | Dónde está la versión vigente |
|--------------------------|------------------------|-------------------------------|
| §1 Visión del producto | no | DTI vFinal §1 |
| §2 Contexto del sistema (C4 N1) | no | DTI vFinal §2 |
| §3 Arquitectura de alto nivel (C4 N2/N3) | no | DTI vFinal §3 |
| §4 Modelo de dominio | no | DTI vFinal §4 |
| §5 Arquitectura hexagonal del core | no | DTI vFinal §5 |
| §7 Asíncrona / event-driven | no | DTI vFinal §7 |
| §8 Despliegue (Docker Swarm DTIC) | no | DTI vFinal §8 |
| §10 Prompt mapping | sí (crece con `PR-IMPL-*`) | `docs/PROMPT_MAPPING.md` |
| §11 NFRs (incl. cobertura ≥90%) | no | DTI vFinal §11 + `AGENTS.md` |
| §21 ADRs | sí (crece) | `docs/adr/` |

> **Solo se escriben aquí las secciones que cambiaron.** El resto se mantiene por
> referencia al DTI vFinal, preservando un único punto de verdad por release.

---

## Checklist del DTP

- [x] Frontmatter con `baseline_ref` (DTI vFinal + tag `release/2.0.0`) y `status: vivo`.
- [x] §A.1 Changelog iniciado.
- [x] §A.3 Estado por FSD-UC con su Design Doc.
- [ ] §A.2 Deltas vs DTI vFinal (se poblará si la implementación diverge).
- [ ] `docs/PROMPT_MAPPING.md` ampliado con `PR-IMPL-*` (al implementar UC-011).
- [x] Baseline congelado (`docs/baseline/`) intacto.
