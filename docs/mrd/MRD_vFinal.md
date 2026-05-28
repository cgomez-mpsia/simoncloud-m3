# Market Requirements Document (MRD) - SimonCloud

## 0. Metadatos
| Campo | Valor |
|-------|-------|
| Producto | SimonCloud |
| Grupo | Carlos Alberto Gomez Ormachea (Individual) |
| Versión | `v1.0.0` |
| Fecha | 2026-05-17 |
| Product Manager | Carlos Alberto Gomez Ormachea |
| Estado | Aprobado |
| Relación con BRD | `BRD_vFinal.md` |

## 1. Resumen ejecutivo
SimonCloud es un ecosistema de gestión documental para la Universidad Mayor de San Simón (UMSS) diseñado para digitalizar trámites, asegurar la trazabilidad de los documentos, y reemplazar el modelo presencial burocrático actual. Con un mercado de miles de estudiantes y administrativos, la plataforma agiliza los procesos, eliminando horas de espera y pérdidas de archivos.

## 2. Visión del producto
Para los estudiantes y personal de la UMSS que sufren por la desorganización documental y colas, SimonCloud es el ecosistema 100% digital que asegura trazabilidad, acceso rápido y confiabilidad, reduciendo tiempos de gestión en un 80%.

## 3. Análisis de mercado
### 3.1 Tamaño de mercado
| Métrica | Valor | Fuente |
|---------|-------|--------|
| TAM | > 80,000 usuarios potenciales | Población estudiantil y administrativa UMSS |
| SAM | 20,000 usuarios activos mensuales | Trámites frecuentes de titulación y kárdex |
| SOM | 5,000 usuarios iniciales (Piloto) | Facultades con mayor adopción tecnológica |

### 3.2 Tendencias del sector
- Digitalización acelerada en instituciones de educación superior pública.
- Integración de firmas digitales y pagos en línea mediante QR Bolivia.
- Almacenamiento seguro en la nube (Cloud-native architectures).

## 4. Segmentación y *personas*
### 4.1 Segmentos de clientes
| Segmento | Tamaño | Necesidad principal | Disposición a pagar |
|----------|--------|----------------------|---------------------|
| Estudiante Pregrado UMSS | 65,000 | Trámite rápido, sin filas físicas | Incluido en matrícula |
| Personal Administrativo UMSS | 5,000 | Trazabilidad y organización | N/A |
| Docentes UMSS | 4,000 | SimonDrop integrado al LMS (Moodle/Classroom) | N/A |
| Usuario Externo (tribunales, evaluadores invitados) | ~500 activos/ciclo | Descargar documentos sin cuenta institucional | N/A (acceso via token) |
| Universidades bolivianas (UCB, UPSA, UMSA, etc.) | ~200,000 usuarios potenciales | Plataforma documental con soberanía de datos | Licencia SCaaS anual por institución |
| Institutos sin infraestructura propia | ~20,000 usuarios potenciales | Plataforma sin inversión en servidores | Suscripción mensual cloud |

### 4.2 Personas
#### MRD-P-01 – Universitario promedio
- **Rol**: Estudiante realizando trámite de titulación.
- **Dolores actuales**: Filas largas, extravío de folders, falta de información sobre el estado del trámite.
- **Comportamiento**: Prioriza herramientas móviles, acostumbrado a pagos por QR.

#### MRD-P-02 – Encargado de Kardex
- **Rol**: Personal administrativo que aprueba trámites.
- **Dolores actuales**: Acumulación de papeles, dificultad para auditar quién tocó el archivo.
- **Comportamiento**: Usa escritorio, requiere dashboards eficientes.

#### MRD-P-03 – Usuario Externo (Tribunal / Evaluador Invitado)
- **Rol**: Miembro de tribunal de defensa de tesis o evaluador externo sin cuenta UMSS.
- **Dolores actuales**: Recibe archivos por email (sin integridad garantizada); no puede autenticarse en WebSISS.
- **Comportamiento**: Accede desde un enlace único con token temporal; solo necesita descargar y verificar el hash SHA-256 del documento asignado.

#### MRD-P-04 – Docente Investigador
- **Rol**: Docente que además de impartir clases gestiona proyectos de investigación y portafolio académico.
- **Dolores actuales**: Necesita localizar versiones históricas de documentos entre cientos de archivos; no tiene forma de buscar por metadatos (SHA-256, rango de fechas, etiqueta semántica).
- **Comportamiento**: Usa búsqueda avanzada, exporta listados a CSV, vincula documentos con ORCID para publicaciones.

## 5. *Jobs-to-be-Done*
| JTBD ID | Cuando… | Quiero… | Para poder… |
|---------|---------|---------|-------------|
| JTBD-01 | Necesito un certificado de notas | Solicitarlo desde mi celular y pagar por QR | Ahorrar medio día de viaje a la universidad |
| JTBD-02 | Un archivo se extravía | Rastrear exactamente en qué oficina está digitalmente | Evitar que el trámite se detenga por semanas |
| JTBD-03 | entrego un trabajo final de alto valor | obtener un comprobante inmutable con hash SHA-256 | tener prueba legal de que entregué a tiempo |
| JTBD-04 | soy evaluador externo invitado a un tribunal | acceder a los documentos de defensa con un enlace temporal | no tener que crear una cuenta ni pedir que me reenvíen archivos por email |
| JTBD-05 | busco una versión anterior de un informe de investigación | filtrar por metadatos (fecha, autor, hash) en un buscador | encontrar el documento exacto sin revisar cientos de archivos manualmente |

## 6. Análisis competitivo
### 6.1 Tabla comparativa
| Criterio | SimonCloud | Sistema Actual (Papel/Manual) | Otras U Públicas |
|----------|------------|-------------------------------|------------------|
| Trazabilidad | Total (Audit Logs + Hash SHA-256) | Nula o muy baja | Media (Sistemas fragmentados) |
| Accesibilidad | Nube (24/7, móvil y desktop) | Horario de oficina | Parcial |
| Alertas proactivas | Sí (Email + Push en tiempo real) | No | No |
| Integración LMS | Moodle + Google Classroom | No | Solo Moodle (algunos) |
| Inmutabilidad legal | Hash SHA-256 (Ley 164 Bolivia) | Ninguna garantía | Ninguna garantía |

### 6.2 *Positioning statement*
> Para **estudiantes y docentes de la UMSS** que hoy pierden tiempo en filas presenciales y no tienen garantía de integridad en sus documentos, **SimonCloud** es el **ecosistema documental universitario** que proporciona trazabilidad legal inmutable mediante certificados SHA-256 y entregas verificadas vía SimonDrop integrado al LMS, a diferencia del sistema actual (papel y email) que no ofrece ni auditoría ni automatización.

### 6.3 Ventaja competitiva sostenible
- **Integración nativa con WebSISS SSO**: ningún competidor externo puede ofrecer autenticación institucional sin acuerdo formal con la UMSS.
- **Cumplimiento Ley 164 Bolivia**: el Hash SHA-256 es un diferenciador regulatorio que convierte al producto en el único con validez legal explícita.

## 7. Propuesta de valor
- **Para el estudiante**: Ahorro de tiempo masivo y predictibilidad.
- **Para la UMSS**: Transparencia, menor uso de papel y reducción de carga operativa.

## 8. Pricing y modelo de negocio

### 8.1 Modelo de cuotas de usuario (transversal a todos los tiers)

| Plan | Almacenamiento | Precio | Método de pago |
|------|---------------|--------|----------------|
| **Freemium** | 15 GB | $0 | Incluido con cuenta institucional |
| **Pro** | 50 GB | Bs. 20/mes (~$3) | QR Simple Bolivia |

El plan Freemium se activa automáticamente al autenticarse con el SSO de la institución. El upgrade a Pro es individual y voluntario.

### 8.2 Tiers institucionales (modelo SCaaS)

SimonCloud opera bajo tres modelos de despliegue según la capacidad de la institución cliente:

| Tier | Cliente tipo | Modelo | Infraestructura | Soberanía de datos |
|------|-------------|--------|-----------------|-------------------|
| **Tier 1 — On-Premise** | UMSS y universidades grandes con DTIC propio | Licencia + soporte | Servidores propios de la institución | Total — datos nunca salen de la universidad |
| **Tier 2 — SCaaS Federado** | Universidades medianas sin DTIC (UCB, UPSA, etc.) | SaaS anual | Servidores UMSS / SimonCloud | Alta — datos en Bolivia, custodia compartida |
| **Tier 3 — SCaaS Cloud** | Institutos pequeños, sin infraestructura | SaaS mensual | Cloud (Supabase / AWS sa-east-1) | Media — datos en región latinoamericana |

**Nota sobre Tier 2**: la institución cliente aporta su propio SSO para autenticación. SimonCloud consume ese IdP y crea un tenant aislado. Los datos del tenant nunca se mezclan con los de UMSS.

**Nota sobre Tier 3**: aplica para instituciones que no pueden mantener servidores y aceptan explícitamente que sus datos residan en infraestructura cloud de terceros. Se recomienda comunicar esta diferencia al cliente durante el contrato.

### 8.3 Revenue model resumido

```
UMSS (Tier 1):         Contrato institucional + soporte técnico anual
Otras Universidades:   Licencia SCaaS/año por número de usuarios activos
Institutos (Tier 3):   Suscripción mensual por GB almacenado
Usuarios Pro:          Bs. 20/mes via QR Simple Bolivia
```

## 9. *Go-to-market*
- **Canal de adquisición**: Portales web de la universidad, centros de estudiantes.
- **Estrategia de lanzamiento**: Piloto en la Facultad de Ciencias y Tecnología (FCyT), seguido de un rollout escalonado al resto de la UMSS.

## 10. Métricas de éxito del producto
- **North Star Metric**: Número de trámites 100% digitales completados por mes.
- **KPIs secundarios**:
  - Tiempo medio de resolución de trámite (reducción del 50%).
  - Volumen de tickets de soporte por extravío de archivos (tendiente a 0).

## 11. Riesgos de mercado
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Resistencia al cambio del personal | Alta | Alto | Talleres de capacitación y diseño centrado en el usuario (UX). |

## 12. Trazabilidad

### 12.1 Persona / JTBD → PRD → FSD

| Persona (MRD §4.2) | JTBD (MRD §5) | PRD-US | PRD-REQ | FSD-UC | Versión |
|--------------------|---------------|--------|---------|--------|---------|
| Estudiante Pregrado | JTBD-01 (certificado QR) | PRD-US-004 | PRD-REQ-004 | FSD-UC-003 | v1.0 |
| Estudiante Pregrado | JTBD-03 (comprobante SHA-256) | PRD-US-003 | PRD-REQ-002 | FSD-UC-002 | v1.0 |
| Personal Administrativo | JTBD-02 (rastrear archivo digitalmente) | PRD-US-017, PRD-US-018 | PRD-REQ-011, PRD-REQ-012 | FSD-UC-005, FSD-UC-006 | v1.0 |
| Docente | JTBD-03 (entrega integrada LMS) | PRD-US-005, PRD-US-006, PRD-US-007 | PRD-REQ-001, PRD-REQ-003 | FSD-UC-001 | v1.0 |
| Usuario Externo | JTBD-04 (acceso sin cuenta institucional) | PRD-US-022 | PRD-REQ-013 | FSD-UC-001 (flujo token) | v1.0 |
| Docente Investigador | JTBD-05 (búsqueda avanzada metadatos) | — *(backlog)* | — *(v2.0)* | — *(v2.0)* | **v2.0** |

> **Nota Docente Investigador**: Su funcionalidad principal (JTBD-05, búsqueda avanzada) está explícitamente fuera del MVP v1.0 (PRD §3.2). En v1.0 accede vía FSD-UC-005 (historial de versiones). La búsqueda avanzada por metadatos se planifica para v2.0 junto con LTI AGS grade passback.

### 12.2 Segmento → BRD → PRD

| Segmento (MRD §4.1) | BRD BR | PRD Épica |
|---------------------|--------|-----------|
| Estudiante Pregrado UMSS | BR-002, BR-007 | Épica 1 (Buzones + Hash), Épica 3 (Almacenamiento) |
| Docentes UMSS | BR-001, BR-002, BR-004 | Épica 2 (Integración LMS) |
| Personal Administrativo UMSS | BR-005, BR-006 | Épica 5 (Gestión Documental) |
| Usuario Externo | BR-006 | Épica 2b (Acceso token temporal) |
| Universidades bolivianas (Tier 2/3) | BR-009 (Multi-tenant) | Backlog v2.0 |

## 12. Supuestos e Hipótesis a Validar

| ID | Hipótesis | Cómo validar | Criterio de éxito |
|----|-----------|--------------|-------------------|
| H1 | El 70% de estudiantes dejaría de usar WeTransfer si SimonCloud genera comprobantes inmutables | Encuesta piloto en FCyT | ≥ 60% en piloto |
| H2 | Los docentes dedican > 30 min por materia a consolidar notas manualmente | Entrevistas a 10 docentes | Promedio confirmado ≥ 25 min |
| H3 | La integración con SSO WebSISS reduce la fricción de adopción en más del 80% | Test A/B (SSO vs. registro manual) | Tasa de activación ≥ 80% con SSO |

## 13. Voz del Cliente (Extractos de Campo)

> *"Siempre tengo miedo de que el enlace de WeTransfer expire antes de que el docente descargue mi tesis. Una vez perdí puntos por eso."*
> — Estudiante de Ingeniería de Sistemas, UMSS (Trabajo de Campo M2)

> *"Recibo 80 archivos por email cuando abro un trabajo. Algunos duplicados, algunos corruptos. Necesito un sistema que centralice todo."*
> — Docente, Lic. A. Terceros, Facultad de Ciencias y Tecnología

> *"El mayor problema es que no sé si el archivo que aprobé es el mismo que tengo guardado. No hay ninguna garantía de integridad."*
> — Personal Administrativo, Dirección Académica UMSS
