# ADR-0005: Cloud Provider AWS + Región sa-east-1 + Estilo de Despliegue ECS Fargate

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-27 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/DTI.md §8`, `docs/DTI.md §17`, `docs/DTI.md §8.4 DR` |

---

## Contexto

SimonCloud debe desplegarse en una infraestructura cloud que cumpla con:
1. **Soberanía de datos**: Ley 164 Bolivia exige que los datos académicos de la UMSS no salgan del territorio nacional (o la región más cercana geográficamente).
2. **Escalado independiente**: `file-service` necesita escalar de 3 a 9 réplicas en periodos de exámenes (NFR-005: 10k uploads).
3. **Gestión de contenedores**: 8 microservicios NestJS con imágenes Docker.
4. **Object Storage con inmutabilidad**: Archivos en SimonDrops cerrados deben ser WORM (Write Once Read Many).
5. **Colas de mensajería**: SQS para Outbox Pattern y notificaciones.
6. **Costo controlado**: Universidad pública; presupuesto limitado.

## Decisión

### Cloud Provider: **AWS**
### Región primaria: **sa-east-1 (São Paulo, Brasil)**
### Estilo de despliegue: **ECS Fargate** (contenedores gestionados sin gestión de servidores)

**Servicios AWS por componente**:

| Componente | Servicio AWS |
|------------|--------------|
| Frontend | S3 + CloudFront |
| Microservicios | ECS Fargate (Cluster compartido, Tasks por servicio) |
| Base de datos | RDS PostgreSQL 16 Multi-AZ |
| Object Storage | S3 Standard + S3 Object Lock (WORM) |
| Cache | ElastiCache Redis 7 (Cluster Mode) |
| Mensajería | SQS Standard + SQS FIFO + DLQ |
| Saga | AWS Step Functions (Standard Workflows) |
| Secrets | AWS Secrets Manager |
| CI/CD | GitHub Actions → ECR → ECS Blue/Green Deploy |
| Monitoreo | CloudWatch + X-Ray |

## Alternativas consideradas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **GCP (Google Cloud)** | Menor presencia en LatAm; región más cercana en Chile (GCPSA-East1). Menor ecosistema de integraciones educativas. GCS no tiene Object Lock nativo equivalente a S3. |
| **Azure** | Mayor costo en región LatAm. AKS más complejo que ECS Fargate para gestionar. Menor familiaridad del equipo. |
| **AWS EKS (Kubernetes gestionado)** | Mayor complejidad operacional que ECS Fargate. Para el volumen actual (8 servicios, equipo de 1 persona), el overhead de Kubernetes no justifica los beneficios. Se puede migrar a EKS en v2.0 si el equipo crece. |
| **AWS Lambda (Serverless)** | Límite de payload 6MB incompatible con uploads de 2GB. Cold starts añaden latencia inaceptable en la API principal. Adecuado solo para funciones de baja frecuencia (purga de papelera, notificaciones). |
| **On-premise (DTIC UMSS)** | La DTIC UMSS no tiene capacidad de gestión de contenedores ni infraestructura de alta disponibilidad. El costo de hardware propio supera el cloud en el horizonte de 3 años. |

## Consecuencias

**Positivas**:
- `sa-east-1` es la región AWS más cercana a Bolivia (~2,800km vs ~8,000km de us-east-1), minimizando latencia para usuarios UMSS.
- ECS Fargate elimina gestión de servidores (sin EC2 que parchear).
- S3 Object Lock nativo para inmutabilidad post-cierre de SimonDrops (WORM compliance).
- SQS gestionado para Outbox Pattern sin gestionar brokers.
- Escalado automático ECS via Application Auto Scaling.

**Negativas**:
- Vendor lock-in parcial en S3, SQS, Step Functions — mitigado usando MinIO (S3-compatible) en entorno local/dev.
- Costo mensual estimado staging: ~$150 USD/mes; producción: ~$400 USD/mes (RDS Multi-AZ domina el costo).
- Latencia `sa-east-1` desde Cochabamba ~80ms (aceptable para el caso de uso).

## Estrategia de Disaster Recovery

- **RPO**: 1 hora (backups PITR de RDS cada hora + versioning S3).
- **RTO**: 4 horas (Warm Standby: réplica RDS siempre activa; ECS tasks mínimas en standby).
- **Estrategia**: Warm Standby en la misma región sa-east-1 (Multi-AZ). No se justifica multi-región para el presupuesto actual.
- **Backups**: RDS automated backups 7 días; S3 versioning habilitado; snapshots manuales antes de releases.
