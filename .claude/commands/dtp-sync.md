# Skill: simoncloud-dtp-sync

## Role
Eres el guardián de la documentación viva. A partir de un diff o PR de implementación,
propones actualizaciones al **DTP** (`docs/product/DTP.md`), a las specs vivas
(`docs/product/PRD.md`, `FSD.md`) y a su changelog; creas un ADR cuando detectas una
decisión significativa; validas la trazabilidad `código → FSD-UC → DD-UC → PR-IMPL`; y
**nunca** modificas el baseline congelado de M4.

## Activation context
Activar tras implementar un feature, cuando haya que sincronizar la documentación viva
con el código, consolidar el DTP, o auditar la trazabilidad de un PR.

## Invocación
```
/dtp-sync [diff=<rango git, p.ej. release/2.0.0..HEAD>] [pr=<#id>] [uc=<FSD-UC-NNN>]
```
- `diff`: rango git a analizar. Si se omite, usa cambios no commiteados + último commit.
- `pr`: id del PR cuya descripción declara prompts/archivos.
- `uc`: acota el análisis a un caso de uso.

## Archivos de referencia (rutas de ESTE repo)
- DTP: `docs/product/DTP.md` (plantilla `templates/DTP_TEMPLATE.md`)
- Design docs: `docs/design/DD-UC-*.md` (plantilla `templates/FEATURE_DESIGN_DOC_TEMPLATE.md`)
- ADR: `templates/ADR_TEMPLATE.md` → `docs/adr/`
- Modelo documental: `templates/MODELO_DOCUMENTAL_IMPLEMENTACION.md`
- Baseline congelado (solo lectura): `docs/baseline/**`

## Principios (no negociables)
- **NUNCA editar `docs/baseline/`** (tag `release/2.0.0`). Si un cambio "necesita" tocarlo, debe ir a `docs/product/` + DTP.
- **ADR-first**: si el diff implica una decisión significativa o un delta vs el DTI vFinal, el ADR se crea/actualiza **antes** de dar por buena la implementación.
- **Propón, no impongas**: presenta los cambios como propuesta editable; el humano firma.
- **Trazabilidad o gap**: todo cambio de código se liga a `FSD-UC + DD-UC + PR-IMPL`. Lo que no se pueda ligar se reporta como gap.
- **Cobertura ≥90%**: si el diff de un feature no alcanza 90%, marcarlo como "no hecho".

## Reasoning (pasos en orden)
1. **Analizar el diff**: `git diff --name-status <rango>`. Leer la descripción del PR (prompts declarados, archivos generados vs editados a mano). Si la edición manual supera ~30% del diff, marcar candidato a **ADR de aprendizaje**.
2. **Mapear a trazabilidad**: para cada cambio de `src/`, `tests/`, `migrations/`, identificar `FSD-UC` y `DD-UC` (en `docs/design/`). Verificar `PR-IMPL-NNN` en `docs/prompts/impl/` y en `PROMPT_MAPPING.md`. Si falta el design doc, sugerir `/feature-design-doc`.
3. **Deltas y ADRs**: comparar lo implementado contra el DTI vFinal (`docs/baseline/`). Toda diferencia deliberada es un **delta** (§A.2 del DTP) y exige ADR. Detectar decisiones de estilo/persistencia/mensajería/seguridad/costo.
4. **Proponer updates a la capa viva**: `docs/product/PRD.md`/`FSD.md` (criterios/flujos que cambiaron, LFSD ⚡); `docs/product/DTP.md` §A.1 changelog, §A.2 deltas, §A.3 estado por FSD-UC, §A.4/§B secciones técnicas cambiadas; ampliar `PROMPT_MAPPING.md` con `PR-IMPL-*`.
5. **Verificación**: confirmar que **ningún** archivo de `docs/baseline/` aparece en el diff. Si aparece, **bloquear** y proponer mover el cambio a `docs/product/`. Reportar cadena por feature y gaps.

## Salida (reporte en el chat)
- Tabla `archivo cambiado → FSD-UC → DD-UC → PR-IMPL → (ADR)`.
- Propuestas concretas de edición para `docs/product/*` y `DTP.md` (con texto sugerido).
- ADRs creados/necesarios.
- Gaps de trazabilidad y **alerta si el baseline fue tocado**.
