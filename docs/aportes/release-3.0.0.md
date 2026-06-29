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
| T-M5-011 | Decisión + ADR de absorción del Design System | Carlos | `docs/adr/0007-absorcion-design-system-supabase-ds.md` | ✅ |
| T-M5-012 | Design doc del cascarón (layout + routing + theme + DS) | Carlos | `docs/design/DD-SHELL-001.md` | ✅ |
| T-M5-013 | Absorción del DS `supabase-ds` (11 componentes + tokens + agentes portados) | Carlos | `libs/design-system/` | ✅ |
| T-M5-014 | Extracción de componentes Supabase (~40 analizados) vía `ds-page-analyzer` | Carlos | `libs/design-system/manifests/` (6 nuevos) | ✅ |
| T-M5-015 | Convención Radix (comportamiento) + fidelidad de estilo Supabase | Carlos | `.claude/agents/ds-component-builder.md`, `libs/design-system/README.md` | ✅ |
| T-M5-016 | Guardianes de trazabilidad (hook `trace-auditor` + subagente `trace-audit`) | Carlos | `.claude/settings.json`, `.claude/agents/trace-audit.md` | ✅ |
| T-M5-017 | Playground del DS (vite + galería de componentes) | Carlos | `libs/design-system/{App,main}.tsx`, `vite.config.ts`, … | ✅ |
| T-M5-018 | Generación de componentes faltantes (TextInput, FormField, CopyButton, DataTable, DropdownMenu…) | Carlos | `libs/design-system/components/` | ⏳ pendiente |
| T-M5-019 | Hand-build de no-extraíbles (Textarea, Toast, Spinner, Radio) | Carlos | `libs/design-system/components/` | ⏳ pendiente |
| T-M5-020 | Construcción del shell `apps/web` (`PR-IMPL-002`) | Carlos | `apps/web/` | ⏳ pendiente |

---

## §3. Feature desarrollado (demo)

- **Funcionalidad**: Acceso de usuario externo con token temporal HMAC-SHA256 (`FSD-UC-011`).
- **Cadena de trazabilidad**: `FSD-UC-011` → `DD-UC-011` → `PR-IMPL-001` → (código) → (tests ≥90%) → DTP.
- **Decisión de arquitectura**: ya resuelta en DTI vFinal §3 (token stateful HMAC); no requirió ADR nuevo (criterio registrado en `DD-UC-011 §3`).

## §4. Sub-sistema Design System (infraestructura frontend)

- **Qué**: DS absorbido de `supabase-ds` → `libs/design-system/` (Atomic Design, tokens Supabase dark, Radix selectivo).
- **Cadena de trazabilidad**: `ADR-0007` (decisión) → `DD-SHELL-001` (diseño shell+DS) → `DTP §B.1` (técnico vivo) → `PROMPT_MAPPING` (PM-007/008/009/010/011).
- **Regla de testing**: el DS es **infraestructura presentacional** → tests visuales/snapshot, no la regla ≥90% (que aplica a la lógica de features). Criterio en `ADR-0007`.
- **Convención de calidad**: Radix solo para comportamiento/accesibilidad; el estilo siempre del manifiesto + tokens (fidelidad Supabase).
