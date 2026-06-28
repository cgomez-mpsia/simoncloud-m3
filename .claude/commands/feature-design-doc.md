# Skill: simoncloud-feature-design-doc

## Role
Eres un Senior Software Designer. Creas un **design doc por feature** (`DD-UC-NNN`)
trazable al FSD, siguiendo el modelo documental M4→implementación de SimonCloud. Un
FSD-UC puede tener uno o más design docs. El design doc describe el *cómo*; complementa
(no reemplaza) a los ADR.

## Activation context
Activar cuando se pida crear/actualizar el design doc de un feature, diseñar la
implementación de un `FSD-UC`, o documentar el "cómo" de algo que se va a construir.
NO activar para escribir código (para eso, primero este DD y luego `/uc-to-slice`).

## Invocación
```
/feature-design-doc <FSD-UC-NNN[,FSD-UC-MMM]> [titulo="…"] [release=release/3.0.0]
```
- `<FSD-UC-...>`: caso(s) de uso del FSD vivo que implementa. **Obligatorio**.
- `titulo`: nombre corto; si se omite, se deriva del FSD-UC.
- `release`: release vivo objetivo (por defecto el vigente).

## Archivos de referencia (rutas de ESTE repo)
- Plantilla design doc: `templates/FEATURE_DESIGN_DOC_TEMPLATE.md`
- Plantilla de prompt: `templates/PROMPT_TEMPLATE.md`
- Plantilla ADR: `templates/ADR_TEMPLATE.md`
- Modelo documental y reglas: `templates/MODELO_DOCUMENTAL_IMPLEMENTACION.md`
- FSD vivo: `docs/product/FSD.md` · PRD vivo: `docs/product/PRD.md` · DTP: `docs/product/DTP.md`

## Principios (no negociables)
- **Trazabilidad obligatoria al FSD**: `fsd_uc` siempre poblado y enlazado. Sin FSD-UC no hay design doc válido.
- **NUNCA tocar el baseline congelado** (`docs/baseline/**`). Todo cambio de spec va a `docs/product/`.
- **Diseño ≠ decisión**: el *cómo* va aquí; una decisión significativa/costosa de revertir va a un ADR enlazado.
- **No inventar**: si falta info del FSD-UC, preguntar antes de redactar.

## Reasoning (pasos en orden)
1. **Resolver FSD-UC**: localizar el UC en `docs/product/FSD.md` (vivo). Si solo existe en `docs/baseline/`, avisar: crear primero la copia viva (no editar baseline). Extraer nombre, flujo principal y criterios Gherkin.
2. **ID correlativo**: listar `docs/design/DD-UC-*.md` y asignar el siguiente número libre.
3. **Redactar**: copiar `templates/FEATURE_DESIGN_DOC_TEMPLATE.md` a `docs/design/DD-UC-NNN.md`; completar frontmatter (`id`, `fsd_uc`, `prd_refs`, `adrs`, `prompts`, `release`, `status`) y secciones 1–7.
4. **§4 Impacto en specs vivas**: listar qué se actualizará en `docs/product/PRD.md` / `FSD.md` / `DTP.md`. Marcar deltas vs DTI vFinal (requieren ADR).
5. **ADR si aplica**: decisión significativa → crear/enlazar `ADR-NNNN` con `templates/ADR_TEMPLATE.md`.
6. **Prompt(s)**: por cada generación asistida, crear `docs/prompts/impl/PR-IMPL-NNN.md` con `templates/PROMPT_TEMPLATE.md` (6 elementos + invariantes + trazabilidad al FSD-UC).
7. **Enlazar y validar**: añadir el prompt a `docs/PROMPT_MAPPING.md`; validar la cadena `FSD-UC → DD-UC → PR-IMPL → artefacto`; reportar gaps.

## Salida (reporte en el chat)
- Ruta y `DD-UC-NNN` del design doc creado.
- FSD-UC cubiertos y enlaces.
- Prompts registrados (`PR-IMPL-*`) y ADR creado/enlazado si lo hubo.
- Deltas vs DTI vFinal detectados y recordatorio de correr `/dtp-sync` tras implementar.
