# Índice de ADRs — SimonCloud

Registro de decisiones arquitectónicas (Architecture Decision Records) del proyecto SimonCloud.

Formato: `docs/adr/00NN-titulo-kebab.md`
Estado posibles: `Propuesta` | `Aceptada` | `Reemplazada por ADR-00NN` | `Obsoleta`

## Índice

| ADR | Título | Estado | Fecha | Trazabilidad |
|-----|--------|--------|-------|-------------|
| [ADR-0001](0001-estilo-arquitectonico.md) | Adopción de Arquitectura Hexagonal + Microservicios + Event-Driven | Aceptada | 2026-05-18 | `DTI §3.1`, `FSD §2.4` |
| [ADR-0002](0002-autenticacion-sso-websiss.md) | Autenticación SSO WebSISS via OAuth2 | Aceptada | 2026-05-18 | `FSD-UC-004`, `DTI §13.2` |
| [ADR-0003](0003-subida-reanudable-s3-multipart-vs-tus.md) | Subidas Reanudables — S3 Multipart Upload vs Protocolo TUS | Aceptada | 2026-05-18 | `FSD-UC-002`, `DTI §17` |
| [ADR-0004](0004-saga-orquestada-quota-upgrade.md) | Saga Orquestada para Upgrade de Cuota con QR Simple | Aceptada | 2026-05-18 | `FSD-UC-003`, `DTI §7.2` |
| [ADR-0005](0005-cloud-provider-y-estilo-de-despliegue.md) | Cloud Provider y Estilo de Despliegue (On-Premise Docker Swarm) | Aceptada | 2026-05-18 | `DTI §8` |
| [ADR-0006](0006-integracion-lms-lti.md) | Integración LMS via LTI 1.3 | Aceptada | 2026-05-18 | `FSD-UC-001`, `DTI §9` |
| [ADR-0007](0007-absorcion-design-system-supabase-ds.md) | Absorción de `supabase-ds` como Design System | Aceptada | 2026-06-28 | `DD-SHELL-001`, `DTP §B` |
| [ADR-0008](0008-alcance-feature-e2e-subida-token-externo.md) | Alcance del primer feature E2E (subida + acceso externo): real vs stub | Aceptada | 2026-06-28 | `FSD-UC-002/011`, `DD-UC-002`, `DTP §A.2` |

## Convenciones

- Numeración correlativa sin saltos: `0001`, `0002`, ...
- Un ADR = una decisión (no mezclar 2 decisiones en 1 ADR)
- Estado `Reemplazada` cuando se crea un ADR nuevo que supera al anterior
- Cada ADR evalúa ≥ 3 opciones con consecuencias positivas y negativas explícitas
- Para crear un nuevo ADR, usar `/project:adr-recorder`
