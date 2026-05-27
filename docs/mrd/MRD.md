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
| Relación con BRD | `BRD_v2.md` |

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
| Estudiante Pregrado | 65,000 | Trámite rápido, sin filas físicas | Incluido en matrícula |
| Personal Administrativo | 5,000 | Trazabilidad y organización | N/A |
| Docentes | 4,000 | Carga y gestión de actas | N/A |

### 4.2 Personas
#### Persona 1 – Universitario promedio
- **Rol**: Estudiante realizando trámite de titulación.
- **Dolores actuales**: Filas largas, extravío de folders, falta de información sobre el estado del trámite.
- **Comportamiento**: Prioriza herramientas móviles, acostumbrado a pagos por QR.

#### Persona 2 – Encargado de Kardex
- **Rol**: Personal administrativo que aprueba trámites.
- **Dolores actuales**: Acumulación de papeles, dificultad para auditar quién tocó el archivo.
- **Comportamiento**: Usa escritorio, requiere dashboards eficientes.

## 5. *Jobs-to-be-Done*
| JTBD ID | Cuando… | Quiero… | Para poder… |
|---------|---------|---------|-------------|
| JTBD-01 | Necesito un certificado de notas | Solicitarlo desde mi celular y pagar por QR | Ahorrar medio día de viaje a la universidad |
| JTBD-02 | Un archivo se extravía | Rastrear exactamente en qué oficina está digitalmente | Evitar que el trámite se detenga por semanas |
| JTBD-03 | entrego un trabajo final de alto valor | obtener un comprobante inmutable con hash SHA-256 | tener prueba legal de que entregué a tiempo |

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
> Para **estudiantes y docentes de la UMSS** que hoy pierden tiempo en filas presenciales y no tienen garantía de integridad en sus documentos, **SimonCloud** es el **ecosistema documental universitario** que proporciona trazabilidad legal inmutable y homologación automática de notas, a diferencia del sistema actual (papel y email) que no ofrece ni auditoría ni automatización.

### 6.3 Ventaja competitiva sostenible
- **Integración nativa con WebSISS SSO**: ningún competidor externo puede ofrecer autenticación institucional sin acuerdo formal con la UMSS.
- **Cumplimiento Ley 164 Bolivia**: el Hash SHA-256 es un diferenciador regulatorio que convierte al producto en el único con validez legal explícita.

## 7. Propuesta de valor
- **Para el estudiante**: Ahorro de tiempo masivo y predictibilidad.
- **Para la UMSS**: Transparencia, menor uso de papel y reducción de carga operativa.

## 8. Pricing y modelo de negocio
- El ecosistema es un SaaS institucional (financiado por la universidad). El servicio al estudiante se apalanca en el presupuesto de infraestructura tecnológica ya existente.

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
| MRD ID | BRD ID | PRD ID |
|--------|--------|--------|
| MRD-01 | BR-01 | PRD-REQ-01 |
| MRD-02 | BR-02 | PRD-REQ-02 |

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
