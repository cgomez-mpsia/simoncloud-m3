# Market Requirements Document (MRD) - SimonCloud

## 0. Metadatos
| Campo | Valor |
|-------|-------|
| Producto | SimonCloud |
| Grupo | Beto (Individual) |
| Versión | `v1.0.0` |
| Fecha | 2026-05-17 |
| Product Manager | Beto |
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

## 6. Análisis competitivo
### 6.1 Tabla comparativa
| Criterio | SimonCloud | Sistema Actual (Papel/Manual) | Otras U Públicas |
|----------|------------|-------------------------------|------------------|
| Trazabilidad | Total (Audit Logs) | Nula o muy baja | Media (Sistemas fragmentados) |
| Accesibilidad | Nube (24/7) | Horario de oficina | Parcial |
| Alertas proactivas | Sí (Notificaciones push) | No | No |

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
