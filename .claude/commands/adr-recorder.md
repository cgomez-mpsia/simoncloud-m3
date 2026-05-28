# Skill: simoncloud-adr-recorder

## Role
Creas y mantienes ADRs en `docs/adr/00NN-titulo-kebab.md` para SimonCloud. Cada ADR documenta una decisión arquitectónica costosa de revertir — no decisiones triviales. Estado inicial: "Propuesta" para nuevas, "Aceptada" para retrospectivas ya implementadas.

## Activation context
Activar cuando: se toma una decisión arquitectónica no trivial (elección de broker, estrategia SHA-256, LTI 1.3, Docker Swarm, MinIO vs S3, hexagonal vs MVC, etc.) o al documentar retrospectivamente decisiones ya tomadas.

## Context / Inputs requeridos
- Decisión a documentar (nombre + descripción en 1-3 líneas).
- `docs/fsd/FSD_vFinal.md` — FSD-UC y NFRs afectados.
- `AGENTS.md` — stack autoritativo para establecer contexto.
- ADRs existentes en `docs/adr/` (para numeración correlativa y evitar solapamientos).

## Reasoning (pasos en orden)

1. **Leer ADRs existentes** para asignar número correlativo sin saltos.
2. **Construir el ADR** con la siguiente estructura:
   - §0 Metadatos: número, título, estado, fecha, decider, FSD-UC/NFR afectados.
   - §1 Contexto: 5-15 líneas — problema + restricciones + fuerzas.
   - §2 ≥ 3 opciones evaluadas (la elegida + 2 descartadas).
   - §3 Decisión + 3-8 líneas de justificación.
   - §4 Consecuencias positivas / negativas / neutras.
   - §5 Impacto: código, operaciones, seguridad, equipo, costo.
   - §6 Plan de reversión.
   - §7 Validación (cómo sabremos que fue correcta).
   - §8 Referencias (FSD §, PRD-REQ-NNN, NFR-NNN, literatura).
3. **Crear archivo** `docs/adr/00NN-titulo-kebab.md`.
4. **Actualizar índice** en `docs/adr/README.md`.
5. **Actualizar trazabilidad** en la columna ADR de la matriz.
6. **Actualizar** `docs/PROMPT_MAPPING.md` con entrada `PM-YYYYMMDD-NNN`.

## Stop condition
Detente cuando: ADR creado con ≥ 3 opciones, consecuencias positivas y negativas explícitas, plan de reversión, y mapeado en README.md de ADRs.

## Output esperado

Archivo `docs/adr/00NN-<titulo-kebab>.md`:

```markdown
# ADR-00NN — <Título>

| Campo | Valor |
|-------|-------|
| Estado | Propuesta / Aceptada / Reemplazada por ADR-00NN |
| Fecha | YYYY-MM-DD |
| Decider | Carlos Alberto Gomez Ormachea |
| FSD-UC afectados | FSD-UC-NNN, FSD-UC-NNN |
| NFR afectados | NFR-NNN |

## 1. Contexto
<problema, restricciones, fuerzas>

## 2. Opciones evaluadas
### Opción A — <elegida>
### Opción B — <descartada>
### Opción C — <descartada>

## 3. Decisión
**<Opción A>** porque <justificación 3-8 líneas>.

## 4. Consecuencias
- **Positivas**: …
- **Negativas**: …
- **Neutras**: …

## 5. Impacto
…

## 6. Plan de reversión
…

## 7. Validación
…

## 8. Referencias
- `docs/fsd/FSD_vFinal.md §…`
- PRD-REQ-NNN
```

## ADRs canónicos sugeridos para SimonCloud
- **ADR-0001 — SHA-256 con módulo nativo `crypto` de Node.js**: por qué no usar librería externa ni calcular en cliente.
- **ADR-0002 — MinIO on-premise vs cloud S3**: soberanía de datos UMSS, Tier 1 on-premise.
- **ADR-0003 — RabbitMQ como broker (vs Kafka, vs Redis Streams)**: throughput, ops on-premise, ausencia de replay como trade-off documentado.
- **ADR-0004 — Outbox Pattern con Prisma `$transaction` para emisión de eventos**: garantía at-least-once sin dual-write.
- **ADR-0005 — Hexagonal Architecture (Ports & Adapters) en NestJS**: aislamiento de dominio, testabilidad.
- **ADR-0006 — JWT stateless vs sesión de servidor**: para WebSISS SSO integration.
- **ADR-0007 — LTI 1.3 deep link para SimonDrop**: por qué LTI 1.3 vs LTI 1.1 vs API propia.

## Invariantes
- MUST: ≥ 3 opciones evaluadas — sin decisiones sin alternativas.
- MUST: Consecuencias negativas explícitas — no "panfleto de la decisión".
- MUST: Plan de reversión — ¿qué hacer si la decisión es incorrecta?
- MUST NOT: ADRs cosméticos ("decidimos usar TypeScript") — solo decisiones costosas de revertir.
- MUST: Un ADR = una decisión (no mezclar 2 decisiones en 1 ADR).

## Mini ejemplo de invocación
> "Crea ADR para la decisión de usar RabbitMQ como broker de SimonCloud. Contexto: on-premise Docker Swarm, sin requisito de replay histórico, operado por DTIC UMSS. Opciones evaluadas: RabbitMQ, Redis Streams, Kafka. Usa `/project:adr-recorder`."
