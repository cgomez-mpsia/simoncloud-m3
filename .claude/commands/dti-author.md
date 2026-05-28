# Skill: simoncloud-dti-author

## Role
Generas y mantienes `docs/DTI.md` (Documento Técnico Inicial) de SimonCloud, consolidando FSD + ADRs + AGENTS.md. Produces diagramas C4 nivel 1/2/3 en Mermaid, bounded contexts, NFRs consolidados, estrategia de resiliencia, IPC, arquitectura EDA y catálogo de eventos.

## Activation context
Activar cuando: existen FSD_vFinal + ADRs (≥ 2) y se necesita poblar o actualizar `docs/DTI.md`. NO activar si el FSD aún no tiene UCs completos.

## Context / Inputs requeridos
- `docs/fsd/FSD_vFinal.md` — UCs, NFRs, BRs, actores.
- `docs/adr/00NN-*.md` — ADRs existentes (stack, broker, hexagonal, SHA-256, etc.).
- `docs/prd/PRD_vFinal.md` — NFRs de alto nivel, épicas, roadmap.
- `AGENTS.md` — stack autoritativo (7 microservicios, NestJS 10, Prisma 5, PostgreSQL 16, RabbitMQ, MinIO, Docker Swarm).
- `docs/PROMPT_MAPPING.md` — actualizar al finalizar.

## Reasoning (pasos en orden)

1. **§0 Metadatos** con enlaces cruzados a BRD/MRD/PRD/FSD/ADRs.
2. **§1 Visión** del producto (heredada de BRD/MRD — SimonCloud ecosistema documental UMSS).
3. **§2.1 C4 nivel 1**: contexto sistema con actores externos (Estudiante, Docente, Administrativo, Usuario Externo, LMS Moodle/Classroom, WebSISS SSO, QR Simple Bolivia).
4. **§2.2 Actores y dependencias**.
5. **§3.1 Estilo arquitectónico**: hexagonal (Ports & Adapters) en cada microservicio; ADR-0005.
6. **§3.2 C4 nivel 2**: 7 contenedores: Gateway, Auth, SimonDrop, Expedientes, Notificaciones, Pagos, AdminPanel + PostgreSQL, MinIO, RabbitMQ.
7. **§3.3 C4 nivel 3**: componentes del módulo crítico (SimonDrop): controller, use case, domain, repository, outbox worker.
8. **§3.4 Sequence diagram**: flujo del UC más crítico (FSD-UC-001 Creación SimonDrop LTI).
9. **§4 Bounded contexts**: Auth, SimonDrop, Expedientes, Notificaciones, Pagos (+ AdminPanel y Gateway como cross-cutting). Entidades, VOs, Aggregates por contexto.
10. **§5 Hexagonal**: diagrama ports & adapters (adapter/in/http, adapter/out/persistence, adapter/out/messaging, domain, application).
11. **§6 Microservicios**: tabla de los 7 servicios con owner funcional, datos propios, dependencias externas, BD propia.
12. **§6.1 Descomposición**: por qué microservicios y no monolito (ADR de descomposición).
13. **§6.2 Resiliencia**: tabla con CB + Retry + Fallback por servicio crítico (usar output de `/project:resilience`).
14. **§6.3 IPC**: tabla de IPC por flujo (usar output de `/project:ipc-selector`).
15. **§7 Arquitectura EDA**: catálogo de eventos + schemas + saga del flujo crítico (usar output de `/project:event-catalog` y `/project:saga`).
16. **§8 Cloud native / Despliegue**: Docker Swarm on-premise (Tier 1 UMSS). Opcionalmente Tier 3 Cloud.
17. **§9 Capa IA**: declarar alcance v1.0 (búsqueda semántica marcada v2.0; en v1.0 solo SHA-256 y trazabilidad).
18. **§10 Prompt mapping**: referencia a `docs/PROMPT_MAPPING.md`.
19. **§11 NFRs consolidados**: espejo de FSD §11 (NFR-001..NFR-NNN).
20. **§12 POCs críticas**:
    - POC-01: SimonDrop end-to-end (ya implementado en `pocs/POC-03/`).
    - POC-02: Token externo firmado para Usuario Externo.
    - POC-03: LTI 1.3 deep link con Moodle.
21. **§13 Seguridad STRIDE**: analizar amenazas por servicio; HTTPS everywhere, JWT signed, SHA-256 para integridad de archivos.
22. **§14 Observabilidad**: logging estructurado JSON, correlationId por request, p99 latency por endpoint, queue depth RabbitMQ.
23. **§15 DevOps**: Docker Swarm deploy, CI/CD pipeline (lint + test + build + deploy).
24. **§16 Anti-patrones**: Distributed Monolith (mitigado con BD por servicio), Dual-write (mitigado con Outbox).
25. **§17 Trade-offs**: tabla de decisiones clave.
26. **§18 Riesgos técnicos**: dependencia WebSISS SSO UMSS (riesgo externo), carga en inicio de semestre, almacenamiento MinIO on-premise.
27. **§19 Roadmap técnico**: v1.0 MVP (Q4 2026) → v2.0 diferenciadores (Q2 2027).
28. **§20 Glosario UMSS**: SHA-256, SimonDrop, WebSISS, QR Simple Bolivia, LTI 1.3, Tier 1/2/3, SCaaS.
29. **§21 Índice ADRs**: tabla de todos los ADRs en `docs/adr/`.
30. **Sincronizar `AGENTS.md`** si se detectan diferencias con el stack implementado.

## Stop condition
Detente cuando: DTI tiene las 21 secciones pobladas, diagramas C4 válidos en Mermaid, tabla de resiliencia con parámetros numéricos, y `docs/PROMPT_MAPPING.md` actualizado.

## Output esperado
- `docs/DTI.md` completo.
- Diagramas Mermaid válidos (sin `style`, `classDef`, IDs sin espacios).
- `docs/adr/README.md` actualizado con índice.
- Entrada en `docs/PROMPT_MAPPING.md`.

## Invariantes
- MUST: C4 nivel 1/2/3 usando `C4Context`/`C4Container`/`flowchart` en Mermaid (no PlantUML).
- MUST: 7 microservicios de SimonCloud con datos propios declarados (sin tablas compartidas).
- MUST NOT: Mezclar lógica de negocio en el Gateway (solo proxy + auth).
- MUST: NFRs del DTI §11 = espejo exacto de FSD §11 (sin inventar nuevos).
- MUST: Toda decisión no trivial referenciada a su ADR.

## Convenciones Mermaid para SimonCloud

| Sección DTI | Tipo Mermaid | Propósito |
|-------------|-------------|-----------|
| §2.1 | `C4Context` | Contexto del sistema con actores externos |
| §3.2 | `C4Container` | 7 contenedores + BD + MinIO + RabbitMQ |
| §3.3 | `flowchart` | Componentes del módulo crítico |
| §3.4 | `sequenceDiagram` | Flujo del UC más crítico |
| §5 | `flowchart` | Puertos y adaptadores hexagonal |
| §6.3 | `flowchart` | Mapa IPC entre servicios |
| §7.2 | `stateDiagram-v2` | Saga del flujo crítico |
| §8 | `flowchart` | Despliegue Docker Swarm |

**Reglas Mermaid obligatorias**:
- IDs: PascalCase o snake_case, sin espacios.
- Labels con `()`: entre comillas dobles `A["Process (main)"]`.
- NUNCA `style`, `classDef`, `:::class`.
- NUNCA HTML entities (`&lt;`, `&gt;`).
- NUNCA `end` como ID de nodo.

## Mini ejemplo de invocación
> "Genera el DTI de SimonCloud. Tengo FSD_vFinal, 3 ADRs, AGENTS.md y PRD_vFinal. Usa `/project:dti-author` y produce todas las secciones hasta §21."
