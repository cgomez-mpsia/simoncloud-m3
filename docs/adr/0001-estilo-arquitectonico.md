# ADR-0001: Adopción de Arquitectura Hexagonal + Microservicios + Event-Driven

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-18 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Revisores** | Docente Módulo 4 |
| **Trazabilidad** | `docs/DTI.md §3.1`, `docs/fsd/FSD_vFinal.md §2.4` |

---

## Contexto

SimonCloud es una plataforma SaaS multi-tenant con 5 dominios de negocio independientes: almacenamiento de archivos, identidad/autenticación, homologación de calificaciones, gestión de cuotas/pagos y notificaciones. Cada dominio tiene patrones de carga radicalmente distintos: el `file-service` recibe picos de 10,000 uploads simultáneos en periodos de exámenes, mientras que el `grade-service` tiene carga constante baja. Además, se requiere integración con 3 sistemas externos (WebSISS, Moodle, Classroom) que pueden fallar independientemente.

## Decisión

Adoptar una arquitectura **híbrida: Microservicios + Hexagonal dentro de cada servicio + Event-Driven para comunicación asíncrona**.

- **Microservicios**: 8 servicios con base de datos propia (Richardson §1.4, *database per service*).
- **Hexagonal**: Cada servicio usa puertos/adaptadores para desacoplar el dominio de la infraestructura.
- **Event-Driven**: Comunicación asíncrona via SQS + Outbox Pattern para flujos que cruzan bounded contexts.

## Alternativas consideradas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **Monolito modular** | No permite escalar independientemente el `file-service` en picos de exámenes (NFR-005). Cambios en el módulo de notas requieren redesplegar el sistema completo. |
| **Serverless puro (Lambda)** | Archivos de 2GB+ exceden límites de payload de Lambda (6MB). Cold starts introducen latencia inaceptable en uploads. |
| **Arquitectura en capas tradicional** | Fuerte acoplamiento a frameworks (NestJS/Spring); dificulta testear el dominio sin inicializar la BD. No permite portar servicios a otro stack. |

## Consecuencias

**Positivas**:
- Escalado independiente de `file-service` en periodos de exámenes.
- Fallos en `grade-service` (Moodle caído) no afectan el servicio de uploads.
- Domain logic testeable sin BD ni framework.

**Negativas**:
- Mayor complejidad operacional (8 contenedores vs 1).
- Consistencia eventual en flujos cross-service (aceptada explícitamente).
- Requiere madurez en observabilidad distribuida (OpenTelemetry + X-Ray).

## Cumplimiento

- ADR-0004 documenta la decisión de Saga orquestada para compensar la consistencia eventual.
- ADR-0005 documenta el mapping a AWS ECS Fargate para el despliegue.
