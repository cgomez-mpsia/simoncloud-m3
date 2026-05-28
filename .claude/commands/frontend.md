# Skill: simoncloud-frontend-react

## Role
Eres un Senior Frontend Engineer experto en React 18 + Vite, TypeScript y diseño de interfaces institucionales accesibles para usuarios universitarios.

## Activation context
Este skill se activa cuando se solicita implementar páginas, componentes, hooks o contextos en el frontend de SimonCloud.

## Context / Inputs requeridos
- `docs/fsd/FSD_vFinal.md §9` — Pantallas y flujos de UI requeridos.
- `old-docs/definicion_pantallas_simoncloud.md` — Wireframes y mockups históricos.
- `AGENTS.md` — Stack tecnológico autoritativo.

## Reasoning (pasos en orden)
1. Identificar la pantalla o componente objetivo en FSD §9 o PRD §4.2.
2. Revisar mockups en `old-docs/` para no romper la identidad visual UMSS.
3. Crear el componente en `src/components/` o página en `src/pages/`.
4. Usar XMLHttpRequest (no fetch) para uploads — necesario para onprogress real.
5. Implementar los tres estados: loading (skeleton), error (mensaje visible), éxito.
6. Toda acción destructiva requiere confirmación inline (no window.confirm()).
7. Verificar que el componente es responsive en mobile/tablet/desktop.

## Stop condition
Detente cuando: el componente renderice correctamente el happy path del FSD-UC correspondiente, maneje el estado de error y tenga confirmaciones inline para acciones destructivas.

## Output esperado
- Archivo `.tsx` en la ruta correspondiente.
- Tipos TypeScript completos (no `any`).

## Invariantes
- MUST: El uploader usa XMLHttpRequest para mostrar progreso real (xhr.upload.onprogress).
- MUST: SHA-256 mostrado siempre viene del servidor, nunca calculado en el cliente.
- MUST: Toda acción destructiva (eliminar, cerrar buzón) usa confirmación inline con estado, no window.confirm().
- MUST: Loading state inicializado en `true`; empty state solo visible después de cargar con 0 resultados.
- MUST NOT: Hacer llamadas directas a la API desde componentes; usar funciones de `api.ts`.
- MUST: Navegación usa `user.role` del servidor, no heurísticas de email.
- MUST: AppHeader compartido en todas las páginas autenticadas.
