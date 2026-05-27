# ADR-0005: Infraestructura On-Premise UMSS + MinIO + Docker Swarm

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-27 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/DTI.md §8`, `docs/DTI.md §17`, `docs/DTI.md §8.4 DR` |

---

## Contexto

SimonCloud es una plataforma institucional de la Universidad Mayor de San Simón (UMSS), una universidad pública boliviana. Gestiona documentos académicos sensibles: actas de notas, entregas en SimonDrop, comprobantes SHA-256 con validez legal.

Los requisitos no funcionales que guían esta decisión son:

1. **Soberanía de datos** — Los datos académicos de estudiantes bolivianos son información personal protegida por la **Ley 164** (Ley General de Telecomunicaciones, Tecnologías de Información y Comunicación de Bolivia). Almacenarlos en servidores extranjeros genera riesgo legal y compromete la autonomía universitaria.
2. **Costo cero de operación cloud** — La UMSS es una universidad pública con presupuesto institucional limitado. Los ~$400 USD/mes de un despliegue AWS en producción representan un costo recurrente injustificable cuando la DTIC ya dispone de servidores propios.
3. **Control total del ciclo de datos** — Auditorías académicas, retención de documentos y cumplimiento del reglamento interno de la UMSS requieren que la institución tenga control directo sobre sus datos, sin depender de políticas de retención de terceros.
4. **Escalado independiente de servicios críticos** — `file-service` necesita escalar de 3 a 9 réplicas en periodos de exámenes (NFR-005: 10k uploads simultáneos).
5. **Inmutabilidad de archivos** — Archivos en SimonDrops cerrados deben ser WORM (Write Once Read Many) bajo control institucional.

---

## Decisión

### Plataforma: **On-Premise en servidores DTIC-UMSS**
### Orquestación de contenedores: **Docker Swarm** (producción) / **Docker Compose** (desarrollo)
### Object Storage: **MinIO** (compatible con API S3)

**Equivalencias tecnológicas por componente**:

| Componente | Tecnología on-premise | Equivalente cloud que reemplaza |
|------------|----------------------|---------------------------------|
| Frontend SPA | **Nginx** (archivos estáticos) | S3 + CloudFront |
| Reverse proxy / Load balancer | **Nginx** con upstream balancing | ALB |
| TLS / HTTPS | **Certbot + Let's Encrypt** o CA interna UMSS | ACM |
| Microservicios (8 servicios) | **Docker Swarm** (replicas por servicio) | ECS Fargate |
| Object Storage binarios | **MinIO** (API S3-compatible, WORM vía Object Lock) | S3 + Object Lock |
| Base de datos | **PostgreSQL 16** (primary + replica en standby) | RDS PostgreSQL Multi-AZ |
| Cache y sesiones upload | **Redis 7 Cluster** (3 nodos, Consistent Hashing) | ElastiCache Redis |
| Cola de mensajes | **RabbitMQ** (exchanges, DLQ nativa) | SQS Standard + DLQ |
| Saga Orchestration | **Temporal.io** (open source, self-hosted) | AWS Step Functions |
| Monitoreo y métricas | **Prometheus + Grafana** | CloudWatch + Dashboards |
| Trazas distribuidas | **Jaeger** (open source) | X-Ray |
| Secretos | **HashiCorp Vault** (self-hosted) o Docker Secrets | Secrets Manager |
| CI/CD | **GitHub Actions** con runner self-hosted en DTIC | CodePipeline / ECR |
| Registry de imágenes | **Gitea + Docker Registry** privado en UMSS | ECR |

### Compatibilidad de código con MinIO

MinIO implementa la misma API que S3. El código del `file-service` no cambia — solo la configuración del endpoint:

```bash
# Producción on-premise
MINIO_ENDPOINT=http://storage.umss.edu.bo:9000
MINIO_ACCESS_KEY=<vault secret>
MINIO_SECRET_KEY=<vault secret>
MINIO_BUCKET=simoncloud-archivos

# Desarrollo local
MINIO_ENDPOINT=http://localhost:9000
```

El SDK de AWS S3 (`@aws-sdk/client-s3`) funciona sin modificación apuntando a MinIO.

---

## Alternativas consideradas y descartadas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **AWS sa-east-1 (São Paulo)** | Datos de estudiantes bolivianos en servidores de Brasil bajo jurisdicción de Amazon (EE.UU.). Incompatible con soberanía de datos y autonomía universitaria. Costo recurrente ~$400 USD/mes inaceptable para presupuesto DTIC. |
| **GCP (Google Cloud)** | Mismas objeciones de soberanía. Región más cercana en Chile (southamerica-east1 São Paulo). Sin ventaja sobre AWS para este caso de uso. |
| **Azure** | Mismas objeciones de soberanía. Mayor costo en LatAm. AKS más complejo para operar con equipo pequeño. |
| **Kubernetes (K8s) on-premise** | Mayor complejidad operacional que Docker Swarm para el volumen actual (8 servicios, equipo DTIC reducido). Puede migrarse a K3s en v3.0 si el equipo crece. |
| **Serverless (OpenFaaS)** | Límite de payload incompatible con uploads de 2GB. Complejidad operacional alta en on-premise. |

---

## Consecuencias

**Positivas**:
- **Soberanía total**: todos los datos académicos residen en servidores físicos de la UMSS bajo control exclusivo de la institución.
- **Costo operativo**: $0/mes de cloud — costo amortizado en hardware ya existente de la DTIC.
- **Cumplimiento Ley 164**: sin transferencia internacional de datos personales de estudiantes bolivianos.
- **Independencia de vendor**: sin lock-in con AWS, Google o Microsoft. Tecnologías 100% open source.
- **MinIO es drop-in replacement de S3**: el código del `file-service` es idéntico. El SDK `@aws-sdk/client-s3` apunta a MinIO sin cambios.
- **Latencia mínima**: servidores en la red local de la UMSS (Cochabamba) → latencia < 5ms para usuarios del campus.

**Negativas / riesgos**:
- **Sin managed services**: el equipo DTIC debe operar PostgreSQL, Redis, RabbitMQ y MinIO. Requiere capacitación y procedimientos de mantenimiento.
- **Alta disponibilidad manual**: sin Multi-AZ automático. Se mitiga con replicación PostgreSQL streaming + MinIO en modo distribuido (4 nodos mínimo para erasure coding).
- **Escalado más lento**: Docker Swarm escala manualmente o via scripts, no con Auto Scaling Groups automáticos.
- **DR más complejo**: sin snapshots gestionados automáticamente. Requiere scripts de backup hacia NAS institucional.

---

## Estrategia de Disaster Recovery

- **RPO objetivo**: 1 hora (backups `pg_basebackup` + WAL archiving cada hora; MinIO versioning habilitado).
- **RTO objetivo**: 4 horas (standby PostgreSQL en hot-standby; servicios Docker Swarm redesplegables en <30min desde imágenes locales).
- **Estrategia**: servidor primario + servidor standby en rack separado del datacenter DTIC.
- **Backups**: dump PostgreSQL diario a NAS institucional; MinIO replication a segundo nodo de storage.
- **Runbook de recovery**: documentado en `docs/runbook/disaster-recovery.md` (Módulo 6).
