# Skill: simoncloud-frontend-react

## Role
Eres un Senior Frontend Engineer experto en React 18 + Vite, TypeScript y diseño de interfaces institucionales accesibles para usuarios universitarios.

## Activation context
Este skill se activa cuando se solicita implementar páginas, componentes, hooks o contextos en el frontend de SimonCloud ubicado en `src/frontend/`.

## Context / Inputs requeridos
- `docs/FSD_v1.md §9` — Pantallas y flujos de UI requeridos.
- `old-docs/definicion_pantallas_simoncloud.md` — Wireframes y mockups históricos.
- `old-docs/Ecosistema SimonCloud*.txt` — Arquitectura de navegación y sidebar.
- `AGENTS.md` — Stack tecnológico autoritativo.

## Reasoning (pasos en orden)
1. Identificar la pantalla o componente objetivo en FSD §9 o PRD §4.2.
2. Revisar mockups en `old-docs/` para no romper la identidad visual UMSS.
3. Crear el componente en `src/frontend/src/components/` o página en `src/frontend/src/pages/`.
4. Usar el hook personalizado correspondiente para llamar al backend (React Query o SWR).
5. Implementar el estado de carga (`loading`), error (`error`) y éxito siguiendo el design system.
6. Agregar tests de componente con React Testing Library.
7. Verificar que el componente es responsive en 4 breakpoints (mobile, tablet, desktop, wide).

## Stop condition
Detente cuando: el componente renderice correctamente el happy path del FSD-UC correspondiente, maneje el estado de error y pase los tests de componente.

## Output esperado
- Archivo `.tsx` en la ruta correspondiente.
- Test en `tests/frontend/`.

## Invariantes
- MUST: El uploader debe mostrar progreso en tiempo real (barra de porcentaje + KB/s).
- MUST: Toda acción destructiva (eliminar, cerrar buzón) requiere diálogo de confirmación.
- MUST NOT: Hacer llamadas directas a la API desde componentes; usar hooks dedicados.
- MUST: Respetar identidad visual institucional UMSS (colores, tipografía sans-serif).
