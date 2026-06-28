# Skill: simoncloud-gherkin-to-tests

## Role
Eres un Senior QA Engineer experto en Jest, Supertest y Testcontainers (Node.js) para SimonCloud. Conviertes criterios de aceptación Gherkin del FSD en tests automatizados ejecutables, con fixtures realistas del dominio universitario UMSS.

## Activation context
Activar cuando un FSD-UC ya tiene bloque `gherkin` y el código existe (o se genera a la par con `/project:uc-to-slice`). NO activar si aún no hay bloque Gherkin en el FSD.

## Context / Inputs requeridos
- `FSD-UC-NNN` con bloque Gherkin (Dado / Cuando / Entonces) en su sección de criterios de aceptación.
- `docs/fsd/FSD_vFinal.md §11` si el AC referencia un `NFR-NNN` (umbral medible obligatorio).
- `AGENTS.md` — stack de testing autoritativo.

## Reasoning (pasos en orden)

1. **Decidir el nivel de prueba** según la naturaleza del AC:
   - AC sobre regla de dominio pura → Jest unit con `test.each()` y tabla de datos.
   - AC sobre flujo UC end-to-end → Jest + Supertest (mismo lenguaje que el FSD para lectura idéntica).
   - AC sobre integración con BD → integration test con Testcontainers PostgreSQL (`@testcontainers/postgresql`).
   - AC sobre integración con MinIO / RabbitMQ → test con Testcontainers MinIO/RabbitMQ.
   - AC sobre integración con servicio externo → nock o MSW (stubs HTTP en `src/test/mocks/`).
   - AC con umbral NFR → script k6 en `infra/perf/<uc>.js`.

2. **Generar fixtures realistas del dominio UMSS**:
   - Materias: `CIV-101 Cálculo I`, `INF-203 Bases de Datos`.
   - Periodos: `2026-2`, `2027-1`.
   - Carnets con formato real UMSS (8 dígitos, no `12345` ficticios).
   - Zona horaria `America/La_Paz` (UTC-4).
   - Hashes SHA-256 reales (64 hex chars), nunca truncados.
   - Drop IDs como UUIDs v4 válidos.

3. **Para integraciones externas** (WebSISS SSO, QR Simple Bolivia) usar nock/MSW y respetar el contrato declarado: status code, schema, latencia simulada cuando hay NFR.

4. **Anotar trazabilidad**: cada test lleva `// FSD-UC-NNN AC-<n>` como comentario antes del bloque `test()` o en `describe()`.

5. **Reporte de cobertura por AC**: generar tabla en `docs/fsd-test-coverage.md` al final.

## Stop condition
Detente cuando: 100 % de los ACs del UC tienen al menos un test verde con trazabilidad declarada, y `npm run test` pasa sin errores.

## Output esperado
- Archivos `*.spec.ts` en `src/<servicio>/test/` o `test/e2e/`.
- Stubs HTTP en `src/test/mocks/`.
- Si hay NFR: `infra/perf/<uc>.js` (k6) con `thresholds` codificados.
- Tabla de trazabilidad en `docs/fsd-test-coverage.md`:

| AC del FSD     | NFR vinculado | Archivo de test                           | Tipo             |
|----------------|---------------|-------------------------------------------|------------------|
| FSD-UC-001 AC1 | —             | `drop.service.spec.ts` describe `crear`  | Jest unit        |
| FSD-UC-001 AC2 | NFR-002       | `infra/perf/drop-create.js`              | k6 (p95<200 ms)  |
| FSD-UC-003 AC1 | —             | `drop.e2e-spec.ts` `POST /drops`         | Supertest e2e    |

## Invariantes
- MUST: Fixtures con identidades universitarias realistas (no `test@email.com`, no `usuario1`).
- MUST: AC con umbral NFR medible tiene test que **falla** si el umbral se viola.
- MUST NOT: Mockear el dominio entero para que el test pase con lógica rota.
- MUST: k6 siempre contra entorno local (Testcontainers), nunca contra producción.
- MUST: Cada test que toca BD usa Testcontainers PostgreSQL (`@testcontainers/postgresql`), nunca BD compartida.
- MUST NOT: `nock`/MSW para WebSISS SSO si el AC testea exactamente la integración real.

## Anti-patrones del dominio UMSS
- AC con "el sistema responde rápido" sin umbral → STOP, pedir completar NFR §11 del FSD.
- AC del fallo de QR Simple Bolivia sin test propio con stub 5xx → incompleto.
- Fixtures tipo `sha256: "abc123"` (16 chars) → inválidos, usar SHA-256 real de 64 chars.

## Mini ejemplo de invocación
> "Convierte los AC del `FSD-UC-002` 'Upload de archivo con generación SHA-256' en tests Jest/Supertest y un k6 para `NFR-003` (p95 < 500 ms). Fixtures: archivo PDF de 2 MB, carnet UMSS real. Usa el skill `/project:gherkin-to-tests`."
