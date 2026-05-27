# Aportes Individuales — release/2.0.0

> **Proyecto**: SimonCloud — Almacenamiento Institucional UMSS  
> **Release**: `release/2.0.0`  
> **Período**: Abril 2026 — Mayo 2026  
> **Módulo**: 4 — Microservicios, Arquitectura Distribuida y AI-SDLC  
> **Fecha de corte**: 2026-05-27

---

## §1. Integrantes del Grupo

| Nombre | Correo | Rol |
|--------|--------|-----|
| Carlos Alberto Gomez Ormachea | carlos@brilliant.tech | Arquitecto / Desarrollador / Documentador (único integrante) |

---

## §2. Tabla de Tareas por Integrante

| ID Tarea | Descripción | Integrante | Artefacto resultante | Horas estimadas | Estado |
|----------|-------------|-----------|---------------------|-----------------|--------|
| T-M4-001 | Arquitectura de microservicios (descomposición por business capability) | Carlos | `docs/DTI.md §2-§6` | 8h | ✅ |
| T-M4-002 | Circuit Breaker pattern (quota-service → QR Simple Bolivia) | Carlos | `docs/DTI.md §6.2`, `docs/dti/DTI_v2.md §2.2` | 4h | ✅ |
| T-M4-003 | Consistent Hashing en Redis Cluster (file-service sessions) | Carlos | `docs/DTI.md §6.2`, `docs/dti/DTI_v2.md §2.3` | 3h | ✅ |
| T-M4-004 | Arquitectura Hexagonal (puertos y adaptadores del file-service) | Carlos | `docs/DTI.md §5`, `docs/diagrams/03-hexagonal-file-service.mmd` | 4h | ✅ |
| T-M4-005 | Saga Orquestada — upgrade de cuota QR Simple | Carlos | `docs/dti/patrones_asincronos.md §1`, `docs/adr/0004-saga-orquestada.md` | 5h | ✅ |
| T-M4-006 | Transactional Outbox Pattern — subida de archivo + notificación | Carlos | `docs/dti/patrones_asincronos.md §2`, `docs/DTI.md §7.3` | 3h | ✅ |
| T-M4-007 | CQRS Read Model — panel de administrador | Carlos | `docs/dti/patrones_asincronos.md §3`, `docs/DTI.md §7.4` | 3h | ✅ |
| T-M4-008 | POC-01: SHA-256 incremental (validación con archivo 2GB) | Carlos | `pocs/POC-01/README.md` | 2h | ✅ |
| T-M4-009 | POC-02: Circuit Breaker Opossum.js en NestJS | Carlos | `pocs/POC-02/README.md` | 2h | ✅ |
| T-M4-010 | DTI vFinal completo (§1-§21, checklist, todos los ADRs) | Carlos | `docs/DTI.md` | 6h | ✅ |
| T-M4-011 | 6 ADRs formales (0001-0006) | Carlos | `docs/adr/0001` a `0006` | 3h | ✅ |
| T-M4-012 | 8 diagramas Mermaid (.mmd) en docs/diagrams/ | Carlos | `docs/diagrams/*.mmd` | 2h | ✅ |
| T-M4-013 | FSD vFinal — 10 UCs con Gherkin, ER, APIs, contratos | Carlos | `docs/fsd/FSD_vFinal.md` | 8h | ✅ |
| T-M4-014 | PROMPT_MAPPING.md con métricas AI-SDLC | Carlos | `docs/PROMPT_MAPPING.md` | 2h | ✅ |
| T-M4-015 | 3 archivos prompts/PR-*.md (PR-UC-001, 002, 006) | Carlos | `prompts/PR-*.md` | 1h | ✅ |
| T-M4-016 | Roadmap técnico (módulos 5, 6 y v2.0) | Carlos | `docs/roadmap.md` | 1h | ✅ |
| T-M4-017 | Despliegue on-premise DTIC-UMSS: mapeo de componentes + soberanía de datos | Carlos | `docs/DTI.md §8`, `docs/adr/0005` | 3h | ✅ |
| T-M4-018 | Seguridad: STRIDE, AuthN/AuthZ, guardrails IA | Carlos | `docs/DTI.md §13` | 2h | ✅ |
| T-M4-019 | MRD, PRD, BRD vFinal reorganizados a rutas correctas | Carlos | `docs/mrd/`, `docs/prd/`, `docs/brd/` | 1h | ✅ |

**Total de tareas**: 19  
**Total horas estimadas**: ~63h

---

## §3. Cálculo de Factor Individual

```
total_tareas_grupo   = 19
n_integrantes        = 1
aporte_promedio      = 19 / 1 = 19 tareas/persona

Carlos: 19 tareas
factor_carlos        = clamp(19 / 19, 0.5, 1.1) = clamp(1.0, 0.5, 1.1) = 1.0

Nota_individual_carlos = Nota_grupal × 1.0
```

---

## §4. Resumen de Contribuciones por Área

| Área | Contribución de Carlos |
|------|----------------------|
| **Documentación técnica** | DTI vFinal completo (§1-§21), 6 ADRs, 8 diagramas .mmd, roadmap |
| **Especificación funcional** | FSD vFinal (10 UCs, Gherkin, ER, contratos API), MRD, PRD, BRD |
| **Patrones arquitectónicos** | Circuit Breaker, Consistent Hashing, Saga, Outbox, CQRS |
| **Pruebas de concepto** | POC-01 (SHA-256 incremental), POC-02 (Circuit Breaker Opossum.js) |
| **AI-SDLC** | PROMPT_MAPPING.md (100% coverage), 3 prompt-contratos formales |
| **Infraestructura** | Despliegue on-premise DTIC-UMSS, ADR soberanía de datos, estrategia DR |
| **Release management** | Creación de rama `release/2.0.0`, estructura de entregables |

---

## §5. Justificaciones y Notas del Docente

*[Espacio reservado para el docente en caso de ajuste individual]*

| Situación | Detalle |
|-----------|---------|
| Integrante único | El grupo G01 está conformado por 1 sola persona; todos los artefactos son de autoría de Carlos Alberto Gomez Ormachea |
| Factor calculado | `factor = 1.0` — aporte promedio coincide con la media grupal (trivialmente, al ser el único) |
| Ajuste docente | — |
