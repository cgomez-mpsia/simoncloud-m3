# Skill: simoncloud-arch-reviewer

## Role
Revisas la arquitectura distribuida de SimonCloud (DTI §6 y artefactos derivados) contra un checklist de 30 criterios: descomposición en microservicios, resiliencia, IPC, API externa, DDD y anti-patrones. Produces reporte con score 0-100, hallazgos críticos y fortalezas. Skill de verificación — NO creas artefactos, solo auditas.

## Activation context
Activar antes de merge a `release/*` o revisión arquitectónica de la entrega final del DTI. NO activar si DTI §6 o la descomposición aún no existen.

## Context / Inputs requeridos
- `docs/DTI.md` §6 (descomposición, tabla servicios, IPC, resiliencia, API externa).
- ADR de descomposición (monolito vs microservicios).
- `docs/diagrams/services_map.mmd` o equivalente.
- ADR de API externa.
- Diagramas de Aggregates opcionales.

## Reasoning (pasos en orden)

Aplicar checklist de 30 criterios (3.33 pts c/u → score = aciertos × 3.33):

### A. Descomposición (6 criterios)
1. Cada microservicio mapea a 1 bounded context o documenta explícitamente por qué se divide.
2. Cada microservicio tiene datos propios (sin tablas PostgreSQL compartidas con otros servicios).
3. Cero JOIN cross-servicio en consultas declaradas en el DTI.
4. Cada microservicio tiene owner asignado (para SimonCloud individual: declarar quién es el responsable funcional de cada servicio).
5. ADR de descomposición evalúa ≥ 3 opciones.
6. ADR usa árbol de decisión explícito (preguntas sobre equipo, tráfico, velocidad de cambio, regulación, ops).

### B. Resiliencia (6 criterios)
7. Tabla de resiliencia para los 3 servicios más críticos (Gateway, SimonDrop, Auth) con dependencias externas.
8. Cada fila declara ≥ 4 parámetros numéricos (timeout, retry max, backoff base, failure rate, sliding window).
9. Retry NUNCA en 4xx (solo 5xx/timeouts).
10. Cada fila declara la métrica observable que valida el patrón.
11. Cada fila declara dimensión CAP sacrificada en caso de partición.
12. Fallback documenta qué se hace cuando todo falla (cero "error 500 al usuario" sin alternativa).

### C. IPC (5 criterios)
13. Tabla IPC con estilo (sync/async/pub-sub) y tecnología por flujo.
14. Cada flujo justifica su elección contra ≥ 2 dimensiones.
15. Ningún flujo síncrono encadena > 3 saltos sin Circuit Breaker (Hidden Coupling).
16. Cada flujo síncrono declara timeout y política de retry.
17. Cada flujo async declara exchange/queue RabbitMQ, garantía, DLQ.

### D. API externa (4 criterios)
18. ADR de API externa evalúa ≥ 3 opciones (Gateway NestJS / BFF / GraphQL) contra ≥ 3 dimensiones.
19. Cada endpoint público declara auth (JWT) y rate limit (throttler).
20. Cero gRPC expuesto directamente al browser/cliente público.
21. Cada query cross-servicio tiene decisión explícita: API Composition (con timeout/fallback) o CQRS.

### E. DDD (5 criterios)
22. Aggregates principales identificados con Root y entities locales/value objects (incluyendo `SHA256Hash` VO, `PeriodoAcademico` VO).
23. Cero setters públicos en los Roots; toda mutación pasa por método con verbo de negocio.
24. Cada método del Root valida al menos 1 invariante de dominio (`BR-NNN`).
25. Cada cambio de estado relevante cross-context emite Domain Event con nombre en pasado.
26. Las 3 reglas del Aggregate respetadas: referencias solo al Root (por UUID), 1 TX Prisma = 1 Aggregate, consistencia inter-aggregate eventual via eventos + Outbox.

### F. Anti-patrones evitados (4 criterios)
27. **Distributed Monolith** NO detectado (cero BD compartida entre servicios, cero despliegues acoplados, cero cadenas REST sync > 3 saltos sin CB).
28. **God microservice** NO detectado (ningún servicio absorbe 3+ bounded contexts; Gateway solo es proxy/auth, no lógica de negocio).
29. **Anemic Domain Model** NO detectado (Roots con lógica BR-NNN, no solo getters/setters + ServiceClass).
30. **Dual-write directo** NO detectado (escritura BD + publish RabbitMQ siempre via Outbox con Prisma `$transaction`).

## Stop condition
Detente cuando: reporte cubre 30 criterios, cada hallazgo tiene acción accionable, score calculado reproduciblemente.

## Output esperado

```markdown
# Auditoría arquitectura distribuida SimonCloud — <fecha>

**Score global**: XX / 100

| Bloque | Aciertos | Total | % |
|--------|----------|-------|---|
| A. Descomposición | / | 6 | |
| B. Resiliencia | / | 6 | |
| C. IPC | / | 5 | |
| D. API externa | / | 4 | |
| E. DDD | / | 5 | |
| F. Anti-patrones | / | 4 | |

## Hallazgos críticos (must-fix antes de release)
- **C15 (Hidden Coupling)**: flujo Gateway→Auth→WebSISS encadena 3 saltos sync sin CB. Riesgo: cascade failure en inicio de semestre. **Acción**: agregar Circuit Breaker en `AuthService` → WebSISS con failure rate 30 %, wait open 15 s.

## Hallazgos menores
- **A6 (árbol de decisión)**: ADR de descomposición menciona "equipo individual" sin enumerar las preguntas del árbol. **Acción**: agregar 5 preguntas en el Context del ADR.

## Fortalezas detectadas
- Cada uno de los 7 microservicios tiene datos propios (sin tablas compartidas).
- Outbox Pattern documentado en DTI §6 para todos los flujos async.
```

## Invariantes
- MUST NOT: Inventar hallazgos — si un criterio no se puede verificar, marcar "no auditable".
- MUST: Cada hallazgo cita sección/archivo exacto donde aplicar la acción.
- MUST: Score calculado reproduciblemente (aciertos × 3.33, redondeado).
- MUST: Hallazgos críticos separados de menores.

## Mini ejemplo de invocación
> "Audita la arquitectura distribuida de SimonCloud. Tengo DTI §6 completo, ADR de descomposición, mapa de servicios y 3 diagramas de Aggregates. Usa `/project:arch-reviewer` y dame score + hallazgos críticos antes de cerrar el release."
