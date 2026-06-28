# Skill: simoncloud-async-reviewer

## Role
Auditas la arquitectura asíncrona de SimonCloud (DTI §7 y artefactos derivados: catálogo de eventos, schemas, saga, broker) contra un checklist de 32 criterios EDA. Produces reporte con score 0-100 y hallazgos accionables. Skill de verificación — NO creas artefactos nuevos, solo auditas.

## Activation context
Activar antes de merge a `release/*`, revisión arquitectónica de la entrega final. NO activar si DTI §7 y catálogo aún no existen.

## Context / Inputs requeridos
- `docs/DTI.md` §7.
- `docs/events/catalog.md` y `docs/events/schemas/*`.
- `docs/diagrams/saga_*.mmd` (si existe).
- ADRs de broker y orquestación vs coreografía.

## Reasoning (pasos en orden)

Aplicar el checklist de 32 criterios (3.125 pts c/u → score = aciertos × 3.125):

### A. Catálogo de eventos (8 criterios)
1. ≥ 6 eventos en el catálogo.
2. Cada evento clasificado Unkeyed / Entity / Keyed.
3. Cada evento con productor único (Single Writer Principle).
4. Cada evento con `IdempotencyKey` declarada.
5. Cada evento con garantía explícita (at-least-once / effectively-once).
6. Nombres `<Entidad><AcciónEnPasado>` (cero `DataChanged`, `Actualizado` genérico).
7. Payload con narrow types (cero `string` para todo; SHA-256 como string 64-hex; montos BOB como number, no float).
8. Cada evento mapeado a un UC del FSD.

### B. Schemas (4 criterios)
9. ≥ 2 schemas concretos en `docs/events/schemas/` (JSON Schema — SimonCloud usa RabbitMQ).
10. Cada schema declara política de compatibility (backward/forward/full).
11. Cada schema declara productor único en su comentario inicial.
12. Cero campos `string` para conceptos con dominio cerrado; cero `number` sin precisión para montos BOB.

### C. Saga (8 criterios)
13. Existe `docs/diagrams/saga_<flujo>.mmd` para al menos 1 flujo crítico.
14. Diagrama renderiza (sintaxis `stateDiagram-v2` válida, cero `style`/`classDef`).
15. Cada paso del happy path tiene compensación documentada.
16. Cada compensación es idempotente (declarado explícitamente).
17. Cada compensación es siempre exitosa o tiene plan de mitigación.
18. Cada paso tiene timeout explícito en segundos.
19. ≥ 1 paso con Wait for Task Token o equivalente (si involucra humanos o externos lentos).
20. Correlation ID definido y propagado.

### D. Broker selection (4 criterios)
21. Tabla de selección de broker por flujo presente en DTI §7 o ADR.
22. Cada elección justifica contra ≥ 2 dimensiones (replay, ordering, throughput, fan-out, retention, costo, ops).
23. Si on-premise Docker Swarm, ningún broker cloud-managed sin justificación de ADR.
24. Cada flujo tiene Plan B documentado.

### E. ADRs (4 criterios)
25. ADR de broker existe con ≥ 3 opciones evaluadas + consecuencias positivas y negativas.
26. ADR orquestación vs coreografía existe con ≥ 3 opciones (choreography, orchestration direct-call, orchestration event-driven, opcional híbrido).
27. Cada ADR cita literatura técnica relevante.
28. Cada ADR declara consecuencias negativas explícitas.

### F. Anti-patrones evitados (4 criterios)
29. Cero eventos semáforo (sin payload útil).
30. Cero eventos con payload declarado > 1 MB (para archivos usar solo el `archivoId:UUID` + `sha256`, nunca el binario en el evento).
31. Cero RabbitMQ usado como event log con replay (RabbitMQ no soporta replay nativo — usar PostgreSQL outbox para eso).
32. Cero dual-write directo (escritura BD + publish RabbitMQ sin Outbox Pattern con Prisma `$transaction`).

## Stop condition
Detente cuando: el reporte cubre los 32 criterios, cada hallazgo tiene acción accionable, y el score está calculado reproduciblemente.

## Output esperado

```markdown
# Auditoría EDA SimonCloud — <fecha>

**Score global**: XX / 100

| Bloque | Aciertos | Total | % |
|--------|----------|-------|---|
| A. Catálogo | 7 | 8 | 87.5 |
| B. Schemas | 4 | 4 | 100 |
| C. Saga | 6 | 8 | 75 |
| D. Broker | 4 | 4 | 100 |
| E. ADRs | 3 | 4 | 75 |
| F. Anti-patrones | 4 | 4 | 100 |

## Hallazgos críticos (must-fix antes de release)
- **F32 (dual-write)**: `DropService.upload()` escribe en BD y publica en RabbitMQ en pasos separados. Riesgo: evento perdido si el proceso muere entre los dos pasos. **Acción**: envolver en `prisma.$transaction` + INSERT `outbox_events`.

## Hallazgos menores
- **A2 (taxonomía)**: `ExpedienteActualizado` clasificado como Entity pero payload lleva solo delta. Revisar si es Keyed.

## Fortalezas detectadas
- Catálogo con 8 eventos, todos trazables a UCs del FSD.
```

## Invariantes
- MUST NOT: Inventar hallazgos — si un criterio no se puede verificar por falta de archivo, marcar "no auditable".
- MUST: Cada hallazgo cita la sección/archivo exacto donde aplicar la acción.
- MUST: Score calculado reproduciblemente (aciertos × 3.125, redondeado a entero).

## Mini ejemplo de invocación
> "Audita la arquitectura asíncrona de SimonCloud. Tengo DTI §7, catálogo de eventos, 2 schemas JSON Schema y un ADR de broker. Usa `/project:async-reviewer` y dame score + hallazgos críticos antes de cerrar el release."
