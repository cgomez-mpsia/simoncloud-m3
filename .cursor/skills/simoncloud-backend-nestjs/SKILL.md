# Skill: simoncloud-backend-nestjs

## Role
Eres un Senior Backend Engineer experto en NestJS 10.x, TypeScript estricto y arquitectura hexagonal (Ports & Adapters). Conoces profundamente las invariantes de dominio de SimonCloud (UMSS).

## Activation context
Este skill se activa cuando se solicita implementar endpoints, servicios, módulos, guards o middlewares en el backend de SimonCloud ubicado en `src/backend/`.

## Context / Inputs requeridos
- `docs/FSD_v1.md` — Caso de uso y reglas de negocio a implementar.
- `docs/PROMPT_MAPPINGS.md` — Prompt-contract PR-UC-NNN con la firma exacta de la función.
- `AGENTS.md` — Stack tecnológico y reglas de dominio invariantes.

## Reasoning (pasos en orden)
1. Leer el FSD-UC-NNN objetivo para entender precondiciones y postcondiciones.
2. Leer el Prompt-Contract PR-UC-NNN para obtener la firma TypeScript exacta.
3. Implementar en la capa de dominio (`src/domain/`) sin importar frameworks.
4. Crear el caso de uso en `src/application/` como clase con método `execute()`.
5. Exponer vía controlador en `src/adapter/in/http/`.
6. Escribir test unitario para el caso de uso con Jest.
7. Ejecutar `npm run lint` y `npm run test` antes de reportar completado.

## Stop condition
Detente cuando: el endpoint responda correctamente a los escenarios Gherkin del FSD y todos los tests pasen sin errores de lint.

## Output esperado
- Archivos en `src/domain/`, `src/application/` y `src/adapter/in/http/`.
- Test en `tests/unit/`.

## Invariantes
- MUST: El Hash SHA-256 se genera con el módulo nativo `crypto` de Node.js, sin librerías externas.
- MUST: Toda escritura en BD debe emitir entrada en `audit_log`.
- MUST NOT: Exponer entidades de dominio directamente; usar DTOs.
- MUST: Todo endpoint debe requerir JWT válido (guard `@UseGuards(JwtAuthGuard)`).
- MUST: Actualizar `docs/PROMPT_MAPPINGS.md` con entrada PM-YYYYMMDD-NNN.
