# Roadmap Técnico — SimonCloud

> **Estado**: post-defensa final Módulo 4 (release/2.0.0)
> **Última actualización**: 2026-05-27

---

## Leyenda de Estados

| Estado | Descripción |
|--------|-------------|
| ✅ Completado | Entregado y evaluado |
| 🔄 En progreso | Trabajo activo |
| 📋 Planificado | Comprometido para próximo módulo |
| 🔮 Futuro | Backlog estratégico |

---

## Hito 1: Módulo 4 — Arquitectura y Documentación (release/2.0.0)

**Período**: Abril — Mayo 2026  
**Estado**: ✅ Completado

| Artefacto | Estado | Notas |
|-----------|--------|-------|
| DTI vFinal (§1-§21, checklist completo) | ✅ | `docs/DTI.md` |
| FSD vFinal (10 UCs, Gherkin, ER, APIs) | ✅ | `docs/fsd/FSD_vFinal.md` |
| MRD vFinal | ✅ | `docs/mrd/MRD_vFinal.md` |
| PRD vFinal | ✅ | `docs/prd/PRD_vFinal.md` |
| BRD vFinal | ✅ | `docs/brd/BRD_vFinal.md` |
| 5 ADRs (0001-0005) | ✅ | `docs/adr/` |
| 8 diagramas Mermaid | ✅ | `docs/diagrams/` |
| POC-01: SHA-256 Incremental | ✅ | `pocs/POC-01/` — validada |
| POC-02: Circuit Breaker Opossum.js | ✅ | `pocs/POC-02/` — validada |
| AGENTS.md sincronizado | ✅ | Raíz del repo |
| PROMPT_MAPPING.md (100% coverage) | ✅ | `docs/PROMPT_MAPPING.md` |
| Patrones asíncronos (Saga, Outbox, CQRS) | ✅ | `docs/dti/patrones_asincronos.md` |

### Lecciones Aprendidas del Módulo 4

1. **Outbox Pattern es crítico**: La doble escritura (BD + broker) es la fuente de bugs más común en microservicios. El Outbox Pattern resuelve esto elegantemente con una sola transacción PostgreSQL.

2. **Circuit Breaker debe configurarse con `volumeThreshold`**: Sin este parámetro, el CB abre en el primer fallo, siendo demasiado agresivo para APIs con latencia variable como QR Simple Bolivia.

3. **SHA-256 incremental es viable y eficiente**: El módulo nativo `crypto` de Node.js procesa 2GB en 18s con solo 12MB de RAM pico. No se necesita ninguna librería externa.

4. **Orquestación > Coreografía para la saga de pagos**: El flujo de QR Simple involucra un webhook asíncrono externo; la coreografía no puede detectar "QR expirado" sin que todos los servicios conozcan el estado global. Temporal.io (self-hosted on-premise) es el orquestador correcto — reemplaza Step Functions con soberanía de datos total.

5. **On-premise LAN < 5ms, cloud como último recurso**: Para el despliegue UMSS on-premise la latencia es < 5ms (LAN). Para el SCaaS Tier 3 (cloud), `sa-east-1` (São Paulo) ofrece ~80ms desde Bolivia vs ~180ms de `us-east-1` — la región más cercana si se necesita cloud.

---

## Hito 2: Módulo 5 — Implementación Core (release/3.0.0)

**Período estimado**: Junio — Julio 2026  
**Estado**: 📋 Planificado

| Tarea | Prioridad | Dependencias |
|-------|-----------|--------------|
| Implementar `file-service` completo (hexagonal + S3 Multipart) | P1 | POC-01 validada ✅ |
| Implementar `auth-service` con SSO WebSISS (staging UMSS) | P1 | Coordinación DTIC |
| Implementar `quota-service` con CB Opossum.js → QR Simple Bolivia | P1 | POC-02 validada ✅ |
| Implementar `simondrop-service` (buzones + cierres) | P2 | file-service |
| Implementar `lms-connector` — OAuth2 Classroom + LTI 1.3 Moodle (sync cursos/tareas + deep link) | P2 | auth-service, simondrop-service, coordinación DTIC para token LTI |
| Acceso para Usuario Externo (descarga sin cuenta institucional, token temporal firmado) | P2 | auth-service, simondrop-service |
| Tests unitarios Jest (cobertura > 90% en file-service y quota-service) | P1 | NFR-002, NFR-010 |
| Integración TestContainers para tests de integración | P2 | — |
| Pipeline CI/CD GitHub Actions → Docker Registry DTIC | P1 | — |

**Métricas objetivo**:
- Cobertura unitaria `file-service` y `quota-service`: ≥ 90% (NFR-002, NFR-010)
- Tiempo de respuesta `POST /quota/upgrade`: p95 < 3s (NFR-010)
- Tiempo de respuesta `POST /upload/init`: p95 < 1s

---

## Hito 3: Módulo 6 — Integración y Despliegue (release/4.0.0)

**Período estimado**: Agosto — Septiembre 2026  
**Estado**: 🔮 Futuro

| Tarea | Prioridad | Notas |
|-------|-----------|-------|
| Integración real con QR Simple Bolivia | P1 | Cuenta merchant QR Simple |
| Deploy staging en servidores DTIC-UMSS (Docker Swarm) | P1 | Coordinación DTIC |
| Panel de administrador con CQRS Read Model | P2 | admin-service |
| Saga completa en Temporal.io (self-hosted) | P2 | quota-service |
| Monitoreo Prometheus + Grafana + Jaeger (on-premise) | P2 | DevOps |
| Pruebas de carga JMeter (NFR-005: 10k uploads) | P1 | NFR validación |

---

## Hito 4: v2.0 — Funcionalidades Diferenciadores

**Período estimado**: 2027  
**Estado**: 🔮 Backlog estratégico

| Funcionalidad | Justificación | Complejidad |
|---------------|---------------|-------------|
| LTI AGS grade passback automático (Moodle + Classroom) | Docente califica en su LMS; SimonCloud recibe la nota vía LTI AGS y la refleja en el portafolio del estudiante; Circuit Breaker para API Moodle | Alta |
| Búsqueda avanzada y filtrado por metadatos | Investigadores y administrativos necesitan localizar documentos por SHA-256, autor, rango de fechas o etiqueta semántica | Alta |
| Migración Google Drive API (FSD §3.2 backlog) | Docentes con archivos existentes en Drive | Alta |
| Firma digital de documentos (PKI institucional) | Resoluciones rectorales firmadas digitalmente | Muy Alta |
| Editor PDF básico en navegador | Ver/anotar PDFs sin descargar | Alta |
| SDK móvil (PWA → app nativa) | 70% usuarios UMSS acceden desde móvil | Media |
| Multi-tenant SCaaS — Tier 2 (universidades con SSO propio) | UCB, UPSA, UMSA se federan vía su IdP; tenant aislado en infra UMSS; licencia anual | Alta |
| Multi-tenant SCaaS — Tier 3 (institutos sin infra) | Supabase/cloud como backend; datos en región LatAm; aceptación explícita del cliente | Alta |
| Integración ORCID para investigadores | Portafolio académico vinculado a identidad global | Media |

---

## Compromisos de Calidad (NFRs en cada release)

| NFR | Criterio | Verificación |
|-----|----------|--------------|
| NFR-002 | SHA-256 en 100% de subidas a SimonDrop | Auditoría BD automatizada en CI |
| NFR-005 | 10k uploads simultáneos | JMeter stress test en staging |
| NFR-006 | Uptime ≥ 99.9% | CloudWatch SLA dashboard |
| NFR-010 | HMAC-SHA256 en 100% de webhooks QR Simple | Test unitario Guard en CI |

---

## Riesgos Activos para el Próximo Módulo

| Riesgo | Probabilidad | Mitigación planificada |
|--------|-------------|------------------------|
| DTIC UMSS no provee acceso a WebSISS staging | Media | Implementar mock SSO para desarrollo; negociar con DTIC en paralelo |
| Recursos de servidores DTIC insuficientes para staging | Media | Provisionar VM adicional en Proxmox DTIC; coordinar con responsable de infraestructura |
| QR Simple Bolivia cambia esquema HMAC | Baja | Validación HMAC encapsulada en Guard — fácil de actualizar |
