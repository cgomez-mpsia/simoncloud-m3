# ADR-0007: Absorción de `supabase-ds` como Design System de SimonCloud

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-06-28 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/product/DTP.md §B`, `docs/design/DD-SHELL-001.md`, CLAUDE.md §Frontend |

---

## Contexto

El frontend de SimonCloud (React 18 + Vite + Tailwind, CLAUDE.md §Frontend) necesita un
sistema de componentes consistente para construir las pantallas de los features
(`release/3.0.0+`). Existe un design system propio del autor, `supabase-ds`
(`/Users/beto/Workspace/GuildHubWorkspace/supabase-ds`), construido extrayendo componentes
de páginas Supabase, con el **mismo stack** (React 18 + TS + Vite + Tailwind v4 + Radix UI +
Lucide) y arquitectura **Atomic Design** (atoms/molecules/organisms + tokens CSS).

Hallazgos relevantes de ese proyecto:

1. **No es un repo limpio del DS**: comparte raíz git con un proyecto de torneo (`Mundial`);
   el único commit corresponde al torneo. El DS está en el working tree, sin historia git
   propia que preservar.
2. **El valor es chico y portable**: `src/` (~180K, componentes + tokens + utils) y **2 agentes**
   (`page-analyzer` con Haiku, `component-builder` con Sonnet) que extraen componentes desde
   `.mhtml`. El resto es peso (node_modules 85M, mhtml 4.9M, dist).
3. **Tema Supabase dark (verde esmeralda)**: se conserva tal cual (decisión del autor); los
   tokens CSS lo hacen re-tematizable a futuro sin tocar componentes.

Para un proyecto académico donde **trazabilidad y *single source of truth* se evalúan**,
mantener el DS en un repo externo entangled genera divergencia y dificulta la auditoría.

---

## Decisión

**Absorber el design system dentro de SimonCloud** (Modelo B — absorción total), copiando el
*contenido y el workflow*, no el repo:

1. **Hogar**: `libs/design-system/` — el DS como unidad coherente, versionada con SimonCloud.
   - `components/` (atoms/molecules/organisms), `tokens/` (Supabase dark), `utils/`.
2. **Pipeline de extracción**: se portan los 2 agentes a `.claude/agents/`
   (`ds-page-analyzer`, `ds-component-builder`), adaptados a las rutas de SimonCloud. Se
   conservan los **manifests**; los **`.mhtml` entran pero gitignored** (material fuente, 4.9M).
   Así se sigue construyendo el DS **dentro** de SimonCloud.
3. **Tema**: se mantiene Supabase dark (tokens CSS sin cambios).
4. **No se trae**: historia git del torneo, `node_modules`, `dist`, ni el proyecto `Mundial`.
   El proyecto externo queda **retirado/archivado**; el DS continúa solo en SimonCloud.

### Encaje en el modelo documental (regla de proceso)

El DS es **infraestructura**, no un feature. Para no ahogarlo en el modelo pesado:
- Se traza **una vez**: este ADR + el design doc del sub-sistema (`DD-SHELL-001` cubre el
  shell y la integración del DS).
- Los **átomos nuevos son livianos**: no requieren un design doc por componente; basta
  registrar el prompt (`PR-IMPL-*`) en `PROMPT_MAPPING.md` si modifican código.
- La regla de **cobertura ≥90% aplica a la lógica de features**, no a componentes puramente
  presentacionales; estos llevan **tests visuales/snapshot** en su lugar.

---

## Alternativas consideradas y descartadas

| Alternativa | Descripción | Razón de descarte |
|-------------|-------------|-------------------|
| **A. Lab + Vendor** | El DS sigue en el repo externo; SimonCloud solo copia componentes terminados | Dos fuentes de verdad, sync manual, trazabilidad partida entre repos — penaliza la evaluación |
| **C. Librería externa (MUI / Chakra / shadcn)** | Adoptar un DS de terceros | Descarta el trabajo ya hecho; estética distinta a la elegida (Supabase dark); el CLAUDE.md del DS prohíbe libs externas de componentes |
| **D. Construir el DS desde cero en SimonCloud** | Empezar de nuevo | Desperdicia componentes de calidad ya construidos y los agentes de extracción |
| **B. Absorción total** ✅ | Traer contenido + workflow al repo | **Elegida**: una sola fuente de verdad, todo trazable en el modelo M4→impl, conserva el trabajo y el pipeline |

---

## Consecuencias

**Positivas**:
- **Single source of truth**: el DS vive y se versiona con SimonCloud; auditable de punta a punta.
- **Continuidad**: los agentes portados permiten seguir extrayendo átomos **dentro** de SimonCloud (cierra la necesidad de trabajar en el repo externo).
- **Stack idéntico**: cero fricción técnica (React 18 + Vite + Tailwind + Radix + Lucide).
- **Repo limpio**: `.mhtml` gitignored; sin node_modules/dist/torneo.

**Negativas / riesgos**:
- **Re-tematización pendiente** (opcional a futuro): la marca es Supabase, no UMSS. Mitigado: todo por tokens CSS.
- **Proceso más pesado** que el del DS original: se mitiga con la regla de "DS = infraestructura, trazado una vez".
- **El working tree externo es la fuente** (no hay git del DS): al absorber se copia el estado actual; cualquier cambio posterior en el repo externo no se sincroniza (queda retirado).
- **Dependencias nuevas**: `@radix-ui/react-*` y `lucide-react` entran al frontend de SimonCloud (ya aprobadas por el stack).

---

## Plan de absorción (ejecución posterior a este ADR)

1. Crear `libs/design-system/` y copiar `components/`, `tokens/`, `utils/`.
2. Portar agentes a `.claude/agents/ds-page-analyzer.md`, `ds-component-builder.md` (rutas + modelos).
3. `.gitignore`: `**/*.mhtml`; conservar `single-pages/.manifests/`.
4. Agregar deps (`@radix-ui/*`, `lucide-react`) al `package.json` del frontend.
5. Registrar en `PROMPT_MAPPING.md` y changelog del DTP. Retirar/archivar el proyecto externo.
