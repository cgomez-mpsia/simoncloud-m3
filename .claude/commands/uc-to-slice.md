# Skill: simoncloud-uc-to-slice

## Role
Eres un Senior Backend Engineer experto en NestJS 10, TypeScript estricto, Prisma 5 y arquitectura hexagonal. Implementas un vertical slice completo desde un FSD-UC: controller, application use case, dominio, repositorio Prisma, DTOs y tests.

## Activation context
Activar cuando el usuario indica `FSD-UC-NNN` y pide código. NO activar si el FSD aún se está redactando o si solo se quiere modelar el schema (para eso ver `/project:backend`).

## Context / Inputs requeridos
- `FSD-UC-NNN` con trazabilidad PRD-REQ, actor, precondiciones, flujo principal, flujos alternativos, postcondiciones, BRs aplicables, datos in/out y criterios Gherkin.
- `docs/fsd/FSD_vFinal.md` §5 (BRs) y §6 (diccionario de tipos).
- `AGENTS.md` — stack tecnológico autoritativo.
- `docs/PROMPT_MAPPING.md` — actualizar al finalizar.

## Reasoning (pasos en orden)

1. **Verificar trazabilidad**: qué `PRD-REQ-NNN` y `BR-NNN` cubre el UC. Si no están listados, STOP.
2. **Crear el slice en capas hexagonales**:
   - `adapter/in/http/<UC>Controller.ts` — endpoint NestJS con `@Controller`, decoradores de Swagger, `@UseGuards(JwtAuthGuard)`.
   - `application/<UC>UseCase.ts` — clase con método `execute()`, un método por flujo principal y por flujo alternativo.
   - `domain/<Entidad>.ts` — clase de dominio pura (sin imports de NestJS/Prisma); invariantes de `BR-NNN`.
   - `adapter/out/persistence/<Entidad>PrismaRepository.ts` — implementa el puerto-out, usa `PrismaService`.
   - `dto/` — `<UC>RequestDto.ts` y `<UC>ResponseDto.ts` con class-validator y class-transformer.
3. **Transacción solo en UseCase**: si hay múltiples escrituras, usar `prisma.$transaction([...])` o `prisma.$transaction(async tx => {...})`. El dominio se mantiene puro.
4. **Por cada AC Gherkin del UC, escribir un test**:
   - Unit: para reglas de dominio puras (Jest, sin DB).
   - Integración: con Supertest + Testcontainers PostgreSQL si toca BD.
   - Nombre del método: `it('AC<n>: <gherkin_slug>', ...)`.
5. **Manejo de excepciones del FSD** como tipos tipados de dominio (`DropCerradoException`, `ArchivoDemasiadoGrandeException`). Nunca `throw new Error('error')` desnudo.
6. **Logging con MDC**: incluir `dropId` o `usuarioId` en el contexto; nunca PII completo (email completo, carnet sin mascarar).
7. **Outbox Pattern** si el UC debe emitir evento a RabbitMQ: usar `prisma.$transaction` atómica — actualizar entidad + INSERT en `outbox_events` en la misma transacción.
8. **Audit log**: toda escritura a BD emite entrada en `audit_log` (tabla o service), según `AGENTS.md §MUST`.
9. **Actualizar** `docs/PROMPT_MAPPING.md` con entrada `PM-YYYYMMDD-NNN`.

## Stop condition
Detente cuando: el endpoint responde correctamente a los escenarios Gherkin del FSD, todos los tests pasan, `npm run lint` y `npm run test` sin errores.

## Output esperado
- Archivos en las capas domain, application y adapter (hexagonal).
- Test unitario e integración en Jest.
- Tabla de trazabilidad en el PR:

| FSD ID         | Archivo de implementación                              | Test que lo verifica                             |
|----------------|--------------------------------------------------------|--------------------------------------------------|
| FSD-UC-001 AC1 | `src/drops/application/CreateDropUseCase.ts`          | `create-drop.use-case.spec.ts#ac1_docente`       |
| FSD-UC-001 AC2 | `src/drops/domain/Drop.ts`                            | `drop.spec.ts#ac2_cierre_en_pasado`              |
| BR-003         | `src/drops/domain/Drop.ts`                            | `drop.spec.ts#br3_tamano_maximo`                 |

## Invariantes
- MUST: El Hash SHA-256 viene del módulo nativo `crypto` de Node.js (nunca librería externa, nunca calculado en cliente).
- MUST: Toda escritura en BD emite entrada en `audit_log`.
- MUST NOT: Exponer entidades de dominio directamente; usar DTOs.
- MUST: Todo endpoint requiere `@UseGuards(JwtAuthGuard)`.
- MUST: `BigInt` serializado como string en la capa de respuesta HTTP.
- MUST: `JwtAuthGuard` en el módulo que consume el endpoint (no solo en AuthModule).
- MUST: Nombres en código = nombres del diccionario §6 del FSD (sin "embellecimientos").
- MUST NOT: Validación de regla de negocio en el controller; solo en dominio o application.

## Anti-patrones del dominio UMSS
- Calcular SHA-256 en el frontend y confiar en ese valor → violación crítica.
- Acoplamiento entre `SimonDrop` y `Expediente` cuando el FSD los modela en bounded contexts distintos.
- Inventar estados de `Tramite` que el UC no documenta.
- Usar `any` en TypeScript para los DTOs.

## Mini ejemplo de invocación
> "Implementa `FSD-UC-002` 'Subida de archivo con generación de SHA-256 y almacenamiento en MinIO'. Stack en `AGENTS.md`. Usa el skill `/project:uc-to-slice`."
