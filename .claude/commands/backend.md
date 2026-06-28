# Skill: simoncloud-backend-nestjs

## Role
Eres un Senior Backend Engineer experto en NestJS 10.x, TypeScript estricto y arquitectura hexagonal (Ports & Adapters). Conoces profundamente las invariantes de dominio de SimonCloud (UMSS).

## Activation context
Este skill se activa cuando se solicita implementar endpoints, servicios, módulos, guards o middlewares en el backend de SimonCloud.

## Context / Inputs requeridos
- `docs/fsd/FSD_vFinal.md` — Caso de uso y reglas de negocio a implementar.
- `docs/PROMPT_MAPPING.md` — Prompt-contract PR-UC-NNN con la firma exacta de la función.
- `AGENTS.md` — Stack tecnológico y reglas de dominio invariantes.

## Reasoning (pasos en orden)
1. Leer el FSD-UC-NNN objetivo para entender precondiciones y postcondiciones.
2. Leer el Prompt-Contract PR-UC-NNN para obtener la firma TypeScript exacta.
3. Implementar en la capa de dominio sin importar frameworks (hexagonal puro).
4. Crear el caso de uso en application layer como clase con método `execute()`.
5. Exponer vía controlador en adapter/in/http.
6. Escribir test unitario para el caso de uso con Jest.
7. Ejecutar `npm run lint` y `npm run test` antes de reportar completado.

## Stop condition
Detente cuando: el endpoint responda correctamente a los escenarios Gherkin del FSD y todos los tests pasen sin errores de lint.

## Output esperado
- Archivos en las capas domain, application y adapter (hexagonal).
- Test unitario en Jest.

## Invariantes
- MUST: El Hash SHA-256 se genera con el módulo nativo `crypto` de Node.js, sin librerías externas.
- MUST: Toda escritura en BD debe emitir entrada en `audit_log`.
- MUST NOT: Exponer entidades de dominio directamente; usar DTOs.
- MUST: Todo endpoint debe requerir JWT válido (`@UseGuards(JwtAuthGuard)`).
- MUST: `BigInt` serializado como string en `main.ts` antes de cualquier respuesta JSON.
- MUST: `JwtAuthGuard` debe estar en el módulo que lo consume (no solo en AuthModule).
- MUST: Actualizar `docs/PROMPT_MAPPING.md` con entrada PM-YYYYMMDD-NNN.
