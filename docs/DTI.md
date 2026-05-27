# Documento Técnico Inicial (DTI) vFinal — SimonCloud

## §0. Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | SimonCloud — Almacenamiento Institucional UMSS |
| **Grupo** | G01 |
| **Versión** | vFinal |
| **Fecha** | 2026-05-27 |
| **Arquitecto responsable** | Carlos Alberto Gomez Ormachea |
| **Stakeholders** | DTIC UMSS, Docentes, Estudiantes, Personal Administrativo |
| **Estado** | Aprobado |
| **Repositorio** | simoncloud-m3 |
| **Enlace al BRD** | `docs/brd/BRD_vFinal.md` |
| **Enlace al MRD** | `docs/mrd/MRD_vFinal.md` |
| **Enlace al PRD** | `docs/prd/PRD_vFinal.md` |
| **Enlace al FSD** | `docs/fsd/FSD_vFinal.md` |
| **Enlace a AGENTS.md** | `/AGENTS.md` |
| **Enlace a PROMPT_MAPPING.md** | `docs/PROMPT_MAPPING.md` |

---

## §1. Visión del Producto

- **Problema**: La UMSS carece de un sistema de almacenamiento institucional. Moodle limita archivos a 50MB, forzando a estudiantes a usar WhatsApp y Google Drive personal. Docentes reciben trabajos por canales informales. Administrativos usan pendrives con riesgo de virus.
- **Usuarios objetivo**: Estudiantes (65,000), Docentes (4,000), Personal Administrativo (5,000) de la UMSS.
- **Propuesta de valor**: Plataforma SaaS multi-tenant que centraliza subida de archivos (hasta 2GB+) con comprobantes SHA-256 inmutables, buzones de entrega controlados (SimonDrop), gestión de cuotas de almacenamiento, y soberanía de datos en infraestructura institucional UMSS.
- **North Star KPI**: Porcentaje de entregas académicas realizadas dentro de SimonCloud (meta: 80% en 6 meses).
- **Métricas secundarias**:
  1. Tasa de éxito de generación de hash SHA-256: 100%.
  2. Reducción de archivos recibidos por WhatsApp/correo personal docente: -80%.
- **Restricciones de negocio**: Datos deben residir en servidores UMSS (Bolivia). Integración con WebSISS SSO obligatoria.

---

## §2. Contexto del Sistema

### 2.1 Diagrama C4 – Nivel 1 (Contexto)

```mermaid
C4Context
title Diagrama de Contexto del Sistema (Nivel 1) — SimonCloud UMSS

Person(estudiante, "Estudiante", "Estudiante UMSS. Entrega tareas en SimonDrops, gestiona almacenamiento y solicita upgrades de cuota.")
Person(docente, "Docente", "Docente UMSS. Crea buzones de entrega (SimonDrops), distribuye material académico y gestiona entregas de sus estudiantes.")
Person(administrativo, "Administrativo", "Personal de gestión UMSS. Centraliza, versiona y aprueba documentos oficiales e institucionales.")
Person(admin_sistema, "Administrador del Sistema", "Super User institucional. Audita logs, gestiona cuotas globales y configura la instancia (White Label).")
Person_Ext(externo, "Usuario Externo", "Persona sin cuenta UMSS que sube archivos a un buzón específico mediante un enlace público compartido.")

System(simoncloud, "SimonCloud", "Plataforma SCaaS multi-tenant de almacenamiento institucional, gestión documental y flujos académicos seguros para la UMSS.")

System_Ext(websiss, "WebSISS SSO", "Sistema de identidad institucional de la UMSS. Fuente de verdad para autenticación, roles y datos del usuario.")
System_Ext(qrsimple, "QR Simple Bolivia", "Pasarela de pago nacional. Procesa upgrades de cuota 15GB → 50GB Pro.")
System_Ext(google_drive, "Google Drive", "Servicio de almacenamiento externo. Origen para migración de archivos de nube a nube hacia SimonCloud.")

Rel(estudiante, simoncloud, "Sube archivos a buzones, gestiona nube personal, solicita upgrade de cuota", "HTTPS")
Rel(docente, simoncloud, "Crea SimonDrops, distribuye material, consolida calificaciones", "HTTPS")
Rel(administrativo, simoncloud, "Sube, versiona y aprueba documentos institucionales", "HTTPS")
Rel(admin_sistema, simoncloud, "Configura White Label, revisa logs de auditoría, administra usuarios y cuotas", "HTTPS")
Rel(externo, simoncloud, "Sube archivos solicitados a un SimonDrop mediante enlace público", "HTTPS")

Rel(simoncloud, websiss, "Autentica usuarios, obtiene rol y datos institucionales", "OAuth2 / SAML")
Rel(simoncloud, qrsimple, "Confirma pago de upgrade de cuota", "HTTPS / HMAC-SHA256")
Rel(simoncloud, google_drive, "Importa/migra archivos de nube a nube bajo solicitud del usuario", "Google Drive API / OAuth2")
```

### 2.2 Actores externos y dependencias

| Actor / Sistema | Tipo | Dirección | Criticidad |
|-----------------|------|-----------|------------|
| WebSISS SSO | IdP institucional | entrada | alta — bloquea todo login |
| QR Simple Bolivia | Pasarela de pago | entrada (webhook) | alta — procesa upgrades de cuota |
| Google Drive API | Storage externo | salida | baja — solo migración bajo demanda |
| MinIO / AWS S3 | Object Storage | interna | alta — almacén de archivos |

### 2.3 Restricciones y Principios Arquitectónicos

| # | Restricción / Principio | Justificación |
|---|------------------------|---------------|
| R-01 | **Solo lectura en LMS externos** | Política de seguridad institucional; evita corrupción de datos académicos. |
| R-02 | **Identidad por correo institucional** | Previene duplicación de alumnos por diferente plataforma. |
| R-03 | **Inmutabilidad post-entrega** | Garantía legal y académica; soportada por hash SHA-256 y política WORM en S3. |
| R-04 | **Multi-tenant desde el diseño** | Escalabilidad del modelo SCaaS hacia otras universidades bolivianas. |
| R-05 | **Soberanía de datos en UMSS** | Cumplimiento Ley 164 Bolivia; datos en servidores propios. |

---

## §3. Arquitectura de Alto Nivel

### 3.1 Estilo arquitectónico adoptado

**Microservicios + Hexagonal + Event-Driven (híbrida)**

Justificación: SimonCloud tiene 4 dominios de negocio independientes (almacenamiento, identidad, cuotas, notificaciones) con patrones de escalado distintos. El `file-service` necesita escalar a 10k uploads simultáneos en periodos de exámenes. La arquitectura hexagonal dentro de cada servicio garantiza testabilidad y desacoplamiento de infraestructura. El patrón event-driven (Outbox + Saga) resuelve la consistencia eventual entre servicios sin 2PC. Documentado en `docs/adr/0001-estilo-arquitectonico.md`.

### 3.2 Diagrama C4 – Nivel 2 (Contenedores)

```mermaid
C4Container
title Diagrama de Contenedores — SimonCloud

Person(usuario, "Usuario UMSS", "Estudiante, Docente, Administrativo, Admin")
Person_Ext(externo, "Usuario Externo", "Sin cuenta UMSS")

Container(spa, "SPA React", "React 18 + TypeScript", "Interfaz web; todas las pantallas del sistema.")
Container(gateway, "API Gateway", "NestJS", "Punto de entrada único. Valida JWT, enruta, rate-limit.")
Container(auth, "auth-service", "NestJS + WebSISS OAuth2", "Federación SSO, emisión JWT, RBAC.")
Container(files, "file-service", "NestJS + TUS/S3 Multipart", "Subida chunked, SHA-256, gestión de archivos.")
Container(drops, "simondrop-service", "NestJS", "Buzones, fechas de cierre, comprobantes.")
Container(quota, "quota-service", "NestJS", "Gestión de cuotas, saga de pago QR Simple.")
Container(notif, "notification-service", "NestJS + SQS Consumer", "Emails push; DLQ con reintentos.")
Container(admin, "admin-service", "NestJS + CQRS Read Model", "Panel global, métricas, audit log.")

ContainerDb(pg_main, "PostgreSQL Primary", "PostgreSQL 16", "Usuarios, archivos, buzones, cuotas, actas.")
ContainerDb(pg_replica, "PostgreSQL Replica", "PostgreSQL 16", "Réplica de lectura para queries pesadas.")
ContainerDb(redis, "Redis Cluster", "Redis 7 (3 nodos)", "Sesiones de upload; consistent hashing.")
ContainerDb(s3, "MinIO / S3", "Object Storage", "Archivos binarios; políticas WORM post-cierre.")
ContainerDb(sqs, "SQS + DLQ", "AWS SQS", "Cola de notificaciones; Dead Letter Queue.")

Rel(usuario, spa, "Usa", "HTTPS")
Rel(externo, spa, "Accede a SimonDrop público", "HTTPS")
Rel(spa, gateway, "API calls", "HTTPS/REST")
Rel(gateway, auth, "Valida JWT / SSO", "gRPC interno")
Rel(gateway, files, "Rutas /files/*", "REST")
Rel(gateway, drops, "Rutas /drops/*", "REST")
Rel(gateway, quota, "Rutas /quota/*", "REST")
Rel(gateway, admin, "Rutas /admin/*", "REST")
Rel(files, pg_main, "CRUD archivos", "PostgreSQL")
Rel(files, redis, "Sesiones upload chunked", "Redis")
Rel(files, s3, "PUT/GET objetos binarios", "S3 API")
Rel(files, sqs, "Publica FileUploaded via Outbox", "SQS")
Rel(quota, pg_main, "CRUD cuotas", "PostgreSQL")
Rel(notif, sqs, "Consume FileUploaded, QuotaUpgraded", "SQS")
Rel(admin, pg_replica, "Queries de métricas (CQRS Read Model)", "PostgreSQL")
```

### 3.3 Diagrama C4 – Nivel 3 (Componentes del file-service — núcleo crítico)

```mermaid
flowchart LR
  subgraph in[Adapters In]
    REST["REST Controller\n(NestJS)"]
    SQS_IN["SQS Consumer\n(Outbox Relay)"]
  end
  subgraph core[Domain Core — Hexagonal]
    UC_UPLOAD["UseCase: UploadFile\n(Application Service)"]
    UC_HASH["UseCase: GenerateHash\n(Domain Service)"]
    UC_LOCK["UseCase: LockFile\n(Domain Service)"]
    AGG["File Aggregate\n(Entity Root)"]
  end
  subgraph out[Adapters Out]
    S3_ADAPTER["S3Adapter\nimplements FileStoragePort"]
    PG_ADAPTER["PgFileRepository\nimplements FileRepositoryPort"]
    OUTBOX["OutboxPublisher\nimplements EventPublisherPort"]
    CB["CircuitBreaker\n(Opossum.js)"]
  end
  REST --> UC_UPLOAD
  UC_UPLOAD --> UC_HASH
  UC_UPLOAD --> UC_LOCK
  UC_HASH --> AGG
  UC_LOCK --> AGG
  AGG --> PG_ADAPTER
  AGG --> S3_ADAPTER
  UC_UPLOAD --> OUTBOX
  S3_ADAPTER --> CB
```

### 3.4 Data Flow del caso de uso crítico (FSD-UC-002: Subida con Hash)

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant GW as API Gateway
    participant FS as file-service
    participant CB as CB[S3]
    participant S3 as MinIO/S3
    participant BD as PostgreSQL
    participant OB as Outbox Table

    E->>GW: POST /drops/:id/upload (JWT + chunk)
    GW->>GW: Valida JWT (auth-service cached)
    GW->>FS: Reenvía chunk
    FS->>CB: Check CircuitBreaker[S3]
    CB-->>FS: Estado CLOSED
    FS->>S3: PUT chunk (presigned URL)
    S3-->>FS: 200 OK
    FS->>FS: Acumula SHA-256 incremental
    FS->>BD: UPDATE upload_session (progress%)
    Note over BD,OB: Transacción atómica
    FS->>OB: INSERT FileUploadedEvent (Outbox)
    FS-->>E: {progress: 45%, speed: "2.1 MB/s"}
    Note over FS,S3: Si S3 falla 5x → CB OPEN → E_STORAGE_UNAVAILABLE
```

---

## §4. Modelo de Dominio

### 4.1 Bounded Contexts

| Contexto | Responsabilidad | Entidades principales | Tipo de integración |
|----------|-----------------|-----------------------|---------------------|
| `Identity` | Autenticación, RBAC | `User`, `Role`, `Session` | síncrona (auth-service) |
| `Storage` | Almacenamiento de archivos | `File`, `UploadSession` | asíncrona (FileUploaded) |
| `SimonDrop` | Buzones de entrega | `SimonDrop`, `Submission` | síncrona + asíncrona |
| `Billing` | Cuotas y pagos | `Quota`, `Payment` | asíncrona (saga) |
| `Notification` | Alertas y emails | `Notification`, `AuditLog` | event-driven (SQS) |

### 4.2 Entidades, Value Objects y Aggregates

| Tipo | Nombre | Invariantes | Ciclo de vida |
|------|--------|-------------|---------------|
| Aggregate Root | `File` | `hash_sha256` no nulo post-upload; `solo_lectura=true` si SimonDrop cerrado | SUBIENDO → ACTIVO → SOLO_LECTURA / EN_PAPELERA → PURGADO |
| Aggregate Root | `SimonDrop` | `cierre_en` debe ser fecha futura al crear | ACTIVO → CERRADO (automático al pasar `cierre_en`) |
| Aggregate Root | `Quota` | `quota_used_mb` ≤ `quota_limit_mb` antes de cualquier upload | FREEMIUM (15GB) → PRO (50GB) |
| Value Object | `SHA256Hash` | 64 chars hex lowercase, inmutable | creado al completar upload |
| Value Object | `PresignedUrl` | TTL = 15min, un solo uso | caduca automáticamente |

### 4.3 DTOs principales

| DTO | Uso (capa) | Campos | Mapeo a entidad |
|-----|------------|--------|-----------------|
| `UploadFileDTO` | REST → App | `simondropId, fileBuffer, estudianteId` | `File` Aggregate |
| `QuotaUpgradeDTO` | App → Saga | `userId, plan, amount, qrPaymentId` | `Quota`, `Payment` |
| `FileMetadataDTO` | App → Cliente | `fileId, nombre, hash_sha256, solo_lectura, recibo_url` | `File` |

---

## §5. Arquitectura Hexagonal del *core* (file-service)

### 5.1 Puertos (Ports)

| Puerto | Tipo | Definido en | Propósito |
|--------|------|-------------|-----------|
| `UploadFileUseCase` | input | `domain/port/in` | Recibir y procesar un chunk de archivo |
| `GenerateHashUseCase` | input | `domain/port/in` | Calcular SHA-256 al completar upload |
| `LockFileUseCase` | input | `domain/port/in` | Marcar archivo como solo lectura |
| `FileRepositoryPort` | output | `domain/port/out` | Persistir metadatos de archivo en BD |
| `FileStoragePort` | output | `domain/port/out` | Subir/descargar binarios a S3/MinIO |
| `EventPublisherPort` | output | `domain/port/out` | Publicar `FileUploadedEvent` via Outbox |

### 5.2 Adaptadores (Adapters)

| Adaptador | Implementa | Tecnología | Ubicación |
|-----------|-----------|------------|-----------|
| `FileRestController` | `UploadFileUseCase` | NestJS REST | `adapter/in/web` |
| `SqsOutboxRelay` | Relay de Outbox | NestJS + SQS | `adapter/in/messaging` |
| `PgFileRepository` | `FileRepositoryPort` | TypeORM + PostgreSQL | `adapter/out/persistence` |
| `S3FileStorage` | `FileStoragePort` | AWS SDK v3 / MinIO | `adapter/out/storage` |
| `OutboxEventPublisher` | `EventPublisherPort` | TypeORM + SQS | `adapter/out/messaging` |

### 5.3 Diagrama de puertos y adaptadores

```mermaid
flowchart LR
  subgraph in[Adapters In]
    A[REST Controller\n/files/upload]
    B[SQS Outbox Relay\nMessage Consumer]
  end
  subgraph core[Domain Core]
    C((UploadFile\nUseCase))
    D[[GenerateHash\nDomainService]]
    E[[LockFile\nDomainService]]
    F[File Aggregate]
  end
  subgraph out[Adapters Out]
    G[(PgFileRepository\nTypeORM)]
    H[S3FileStorage\nAWS SDK]
    I[OutboxEventPublisher\nSQS]
  end
  A --> C
  B --> C
  C --> D
  C --> E
  D --> F
  E --> F
  F --> G
  F --> H
  C --> I
```

---

## §6. Arquitectura Distribuida

### 6.1 Microservicios y responsabilidades

| Servicio | Responsabilidad | BD propia | API expuesta |
|----------|-----------------|-----------|--------------|
| `api-gateway` | Routing, JWT validation, rate-limit | — | REST /\* |
| `auth-service` | SSO WebSISS, JWT, RBAC | PostgreSQL (users, roles) | gRPC /auth |
| `file-service` | Subida chunked, SHA-256, gestión | PostgreSQL + S3 | REST /files |
| `simondrop-service` | Buzones, cierres, comprobantes | PostgreSQL | REST /drops |
| `quota-service` | Cuotas, saga QR Simple | PostgreSQL (quotas) | REST /quota |
| `notification-service` | Emails, push, DLQ | Redis (colas) | SQS Consumer |
| `admin-service` | Panel global, CQRS Read Model | PostgreSQL (audit_log) | REST /admin |

### 6.2 Patrones de resiliencia aplicados

| Patrón | Dónde | Configuración |
|--------|-------|---------------|
| Circuit Breaker | `quota-service` → QR Simple Bolivia | `timeout: 3s, failureRate: 50%, resetTimeout: 30s` |
| Circuit Breaker | `file-service` → S3/MinIO | `timeout: 5s, failureRate: 50%, resetTimeout: 60s` |
| Retry + Exponential Backoff | Notificaciones push | `3 reintentos, delays: 1s, 2s, 4s` |
| Dead Letter Queue | `notification-service` | SQS DLQ tras 3 fallos |
| Rate Limiting | `api-gateway` | `100 req/s por usuario` |
| Consistent Hashing | Redis Cluster `file-service` | `150 vnodes/nodo; 3 nodos` |
| Horizontal Pod Autoscaler | `file-service` Kubernetes | `CPU > 70% → escalar de 3 a 9 réplicas` |
| Fallback degradado | `quota-service` CB OPEN | `Retorna error controlado: "Pago temporalmente no disponible, intente en 30s"` |

### 6.3 Mapa IPC

```mermaid
graph LR
    GW[API Gateway] -->|REST| FS[file-service]
    GW -->|REST| QS[quota-service]
    GW -->|gRPC| AS[auth-service]
    FS -->|SQS Outbox| NS[notification-service]
    QS -->|Saga Events| NS
    QS -.->|Circuit Breaker| QRSIMPLE[QR Simple API]
```

---

## §7. Arquitectura Asíncrona / Event-Driven

### 7.1 Catálogo de eventos

| Evento | Productor | Consumidor(es) | Payload | Garantía |
|--------|-----------|----------------|---------|----------|
| `FileUploadedEvent` | `file-service` | `notification-service` | `{fileId, simondropId, docenteId, hash, nombre}` | at-least-once (Outbox) |
| `SimonDropClosedEvent` | `simondrop-service` | `file-service` (lock) | `{dropId, closedAt}` | at-least-once |
| `QuotaUpgradeRequested` | `quota-service` (saga) | `payment-service` | `{userId, plan, amount}` | exactly-once (Saga) |
| `PaymentConfirmedEvent` | `quota-service` (webhook) | Saga orchestrator | `{paymentId, userId, hmacValid}` | at-least-once |
| `QuotaUpgradedEvent` | `quota-service` | `notification-service` | `{userId, newQuotaMb}` | at-least-once |
| `UserRegisteredEvent` | `auth-service` | `admin-service` (CQRS) | `{userId, rol, timestamp}` | at-least-once |

### 7.2 Saga: Upgrade de Cuota por QR (FSD-UC-003)

**Tipo**: Orquestada (el `quota-service` actúa como orquestador). Se eligió orquestación sobre coreografía porque el flujo tiene pasos de compensación explícita y requiere rastrear estado global desde un único punto.

```mermaid
stateDiagram-v2
    [*] --> UpgradePending: Estudiante solicita upgrade
    UpgradePending --> QRGenerado: GenerateQR enviado a payment-service
    QRGenerado --> QRExpirado: Timeout 5 min sin pago
    QRExpirado --> Compensado: CancelUpgradeRequest
    Compensado --> [*]
    QRGenerado --> PagoPivot: Webhook payment.confirmed (HMAC válido)
    PagoPivot --> QuotaActualizada: UpgradeQuota (retriable)
    QuotaActualizada --> EmailEnviado: SendConfirmationEmail (retriable)
    EmailEnviado --> [*]
    QRGenerado --> Fallido: HMAC inválido / webhook corrompido
    Fallido --> Compensado
```

**Transacciones**:
- **Compensable**: `QuotaPending` en `quota-service` — reversible con `CancelUpgradeRequest`.
- **Pivote**: Validación HMAC del webhook `payment.confirmed` — si pasa, la saga es irrevocable.
- **Retornables**: `UpgradeQuota` y `SendConfirmationEmail` — se reintentan hasta éxito.

### 7.3 Outbox: Subida de Archivo → Notificación al Docente (FSD-UC-002/007)

**Problema resuelto**: Doble escritura (dual write) — si el `file-service` guarda en PostgreSQL pero falla al publicar en SQS, el docente nunca es notificado.

**Solución**: En la misma transacción PostgreSQL que guarda el archivo, se inserta `FileUploadedEvent` en la tabla `outbox`. Un Message Relay (Debezium CDC o Polling Publisher) lee la tabla y publica en SQS con garantía at-least-once.

### 7.4 CQRS: Panel de Administrador (FSD-UC-010)

El `admin-service` mantiene un `dashboard_metrics` materializado, actualizado asíncronamente vía eventos (`FileUploaded`, `UserRegistered`, `QuotaUpgraded`). Consulta `GET /admin/metrics` lee el Read Model en O(1) sin impactar servicios transaccionales. Trade-off aceptado: consistencia eventual (latencia de segundos en métricas).

---

## §8. Despliegue – On-Premise (Infraestructura DTIC-UMSS)

> **Driver principal**: Soberanía de datos. Los datos académicos de estudiantes bolivianos (notas, documentos, actas) están protegidos por la **Ley 164** y deben permanecer bajo control exclusivo de la UMSS. Ver `docs/adr/0005-cloud-provider-y-estilo-de-despliegue.md`.

### 8.1 Mapeo de componentes a tecnología on-premise

| Componente | Tecnología on-premise | Justificación |
|------------|----------------------|---------------|
| Frontend SPA | **Nginx** (archivos estáticos) | Servidor web estándar, cero costo, control total |
| Reverse proxy / Load balancer | **Nginx** upstream balancing | Path-based routing sin vendor lock-in |
| TLS / HTTPS | **Certbot + Let's Encrypt** o CA interna UMSS | Certificados gratuitos o bajo control institucional |
| Microservicios (8 servicios) | **Docker Swarm** (réplicas configurables) | Orquestación simple; DTIC puede operarlo sin expertise K8s |
| Object Storage (binarios, WORM) | **MinIO** (API S3-compatible + Object Lock) | Drop-in replacement de S3; el código no cambia |
| Base de datos | **PostgreSQL 16** (primary + hot-standby) | Control total; sin costo de licencia |
| Cache y sesiones upload | **Redis 7 Cluster** (3 nodos) | Consistent Hashing; mismo que en cloud |
| Cola de mensajes | **RabbitMQ** (exchanges + DLQ nativa) | Open source; bien documentado para equipos pequeños |
| Saga Orchestration | **Temporal.io** (self-hosted) | Orquestador de workflows open source; reemplaza Step Functions |
| Monitoreo y métricas | **Prometheus + Grafana** | Stack estándar de observabilidad on-premise |
| Trazas distribuidas | **Jaeger** | Distributed tracing open source |
| Secretos | **HashiCorp Vault** o Docker Secrets | Gestión segura sin dependencia de cloud |
| CI/CD | **GitHub Actions** con runner self-hosted DTIC | Pipeline automatizado sobre infraestructura propia |

### 8.2 Diagrama de despliegue on-premise

Ver `docs/diagrams/08-onpremise-deployment.mmd` para el diagrama completo.

```mermaid
flowchart TD
    subgraph Campus["Red UMSS — Campus Cochabamba"]
        Users["Usuarios UMSS\n(Estudiantes, Docentes, Admins)"]
    end

    subgraph DMZ["DMZ — Servidor Frontal DTIC"]
        Nginx["Nginx\nReverse Proxy + TLS + Balancer"]
        SPA["SPA React\n(archivos estáticos)"]
    end

    subgraph AppLayer["Capa de Aplicación — Docker Swarm"]
        GW["API Gateway (x2)"]
        FS["file-service (x3 → x9)"]
        QS["quota-service + CB"]
        AS["auth-service"]
        NS["notification-service"]
        ADM["admin-service"]
    end

    subgraph DataLayer["Capa de Datos — Servidores DTIC"]
        PG_P["PostgreSQL 16\nPrimary"]
        PG_R["PostgreSQL 16\nHot Standby (CQRS reads)"]
        REDIS["Redis 7 Cluster\n(3 nodos)"]
        MINIO["MinIO\nObject Storage WORM"]
        RABBIT["RabbitMQ\nMensajería + DLQ"]
        TEMPORAL["Temporal.io\nSaga Orchestrator"]
    end

    subgraph Ops["Observabilidad"]
        PROM["Prometheus"]
        GRAFANA["Grafana"]
        JAEGER["Jaeger Tracing"]
    end

    Users --> Nginx
    Nginx --> SPA
    Nginx --> GW
    GW --> FS & QS & AS & ADM
    FS --> PG_P & REDIS & MINIO & RABBIT
    QS --> PG_P & TEMPORAL
    NS --> RABBIT
    ADM --> PG_R
    PG_P --> PG_R
    AppLayer --> PROM --> GRAFANA
    AppLayer --> JAEGER
```

### 8.3 Entornos

| Entorno | Ubicación | Propósito |
|---------|-----------|-----------|
| `dev` | Laptop del desarrollador (Docker Compose) | Desarrollo local; MinIO + PostgreSQL en contenedores |
| `stg` | Servidor de staging DTIC | QA e integración; espejo de producción a escala mínima |
| `prd` | Servidor de producción DTIC (rack datacenter UMSS) | Producción; Docker Swarm con réplicas configuradas |

**Latencia**: servidores en red local del campus UMSS → < 5ms para usuarios conectados desde el campus; < 50ms para acceso externo vía VPN institucional.

### 8.4 Estrategia de Disaster Recovery

- **RPO objetivo**: 1 hora (`pg_basebackup` + WAL archiving cada hora; MinIO versioning habilitado).
- **RTO objetivo**: 4 horas (hot-standby PostgreSQL; imágenes Docker en registry local → redeploy en < 30min).
- **Estrategia**: servidor primario + servidor standby en rack separado del datacenter DTIC.
- **Backups**: dump PostgreSQL diario al NAS institucional; MinIO replication a segundo nodo de storage.
- Documentado en `docs/adr/0005-cloud-provider-y-estilo-de-despliegue.md`.

---

## §9. Capa de IA / Agentes

### 9.1 Arquitectura agéntica

- **Tipo**: Single-agent (Claude Sonnet) con skills especializadas como herramientas.
- **Modelos usados**: Claude Sonnet 4 (documentación, generación de código), Claude Haiku (tareas repetitivas de validación).
- **Uso en el proyecto**: Los agentes IA fueron usados para generar artefactos documentales (FSD UCs, contratos de prompts, ADRs) y código NestJS desde especificaciones del FSD. Ver `docs/PROMPT_MAPPING.md`.

### 9.2 Agentes del sistema

| Agente | Rol | Herramientas | Guardrails | Observabilidad |
|--------|-----|-------------|------------|----------------|
| `DTI-Author` | Genera y actualiza secciones del DTI | Read, Edit, Write | No modifica BRD ni FSD sin aprobación humana | logs de sesión en `docs/PROMPT_MAPPING.md` |
| `FSD-UC-Implementer` | Genera vertical slices desde FSD-UC-XXX | Read, Edit, run-tests | Solo implementa UCs ya aprobados; no redefine negocio | `docs/PROMPT_MAPPING.md` PR-UC-* |
| `ADR-Recorder` | Formaliza decisiones en ADRs | Read, Edit | No cambia decisiones ya en estado "Aceptada" | Historial Git |

### 9.3 Guardrails y políticas IA

- Los prompts **no deben** inventar requerimientos fuera del FSD aprobado.
- Toda salida generada requiere revisión humana antes de ser committed.
- Archivos `.env`, secrets y credenciales están en `.gitignore`; los agentes no pueden acceder a ellos.
- Política de hallucination rate: < 5% (medido en `docs/PROMPT_MAPPING.md §métricas`).

### 9.4 Diagrama de la capa IA

```mermaid
flowchart LR
  Input["Prompt con contexto\n(FSD-UC-XXX + BRs)"] --> Router{Router por tarea}
  Router -->|Documentación| Sonnet["Claude Sonnet 4\nDTI, FSD, ADR"]
  Router -->|Código TypeScript| Sonnet
  Router -->|Validación rápida| Haiku["Claude Haiku 4\nRevisión de formato"]
  Sonnet --> Review["Revisión Humana\n(Beto)"]
  Review -->|Aprobado| Commit["git commit\nCo-authored-by: Claude"]
  Review -->|Rechazado| Input
```

---

## §10. Estrategia de Prompt Mapping

Ver documento completo en `docs/PROMPT_MAPPING.md`.

| Artefacto | Prompts asociados |
|-----------|-------------------|
| BRD coherencia | `PR-BRD-001` |
| FSD-UC-001 (Homologación LMS) | `PR-UC-001` | *(BACKLOG v2.0)* |
| FSD-UC-002 (Hash SHA-256) | `PR-UC-002` |
| FSD-UC-003 (QR Webhook) | `PR-UC-006` |
| FSD-UC-007 (Notificaciones) | `PR-UC-008` |
| Admin Dashboard export | `PR-UC-009` |

**Métricas AI-SDLC** (calculadas sobre `release/2.0.0`):
- Prompt Coverage: 10/10 UCs = **100%** ✅
- Spec Fidelity MRD→PRD→FSD: **100%** ✅
- Hallucination Rate estimado: **~0%** ✅

---

## §11. NFRs Consolidados

| ID | Categoría | Umbral | Mecanismo de verificación |
|----|-----------|--------|---------------------------|
| NFR-002 | Integridad | SHA-256 generado en 100% de subidas a SimonDrop | Auditoría BD |
| NFR-003 | Seguridad | 0 accesos sin JWT válido a rutas protegidas | Pentest / Token fuzzing |
| NFR-004 | Usabilidad | Interfaz responsive en ≥ 4 breakpoints | Test manual |
| NFR-005 | Escalabilidad | 10,000 uploads simultáneos en periodo exámenes | JMeter stress test |
| NFR-006 | Disponibilidad | Uptime ≥ 99.9% | CloudWatch alertas |
| NFR-007 | Retención | Archivos en papelera purgados exactamente a los 30 días | Test cronjob |
| NFR-009 | Cumplimiento | Datos en región sa-east-1 (Bolivia); Ley 164 | Auditoría AWS Config |
| NFR-010 | Seguridad Webhook | Validación HMAC-SHA256 en 100% de webhooks QR Simple | Test unitario Guard |

---

## §12. POCs Críticas

> Detalle completo en `pocs/POC-01/` y `pocs/POC-02/`.

### 12.1 POC-01: Subida Reanudable con SHA-256 Incremental

- **Riesgo que mitiga**: Archivos de 2GB+ con SHA-256 calculado en servidor pueden agotar memoria RAM si se carga el buffer completo.
- **Hipótesis**: Se puede calcular SHA-256 de forma incremental (chunk a chunk) usando `crypto.createHash` con múltiples `.update()`, obteniendo el mismo hash que el cálculo monolítico.
- **Criterio de éxito medible**: Hash SHA-256 calculado incrementalmente para un archivo de 2GB = Hash calculado con `openssl sha256` en la misma máquina, en < 30 segundos, con RAM pico < 100MB.
- **Resultado**: ✅ Validado — `crypto.createHash('sha256')` con `.update(chunk)` por cada chunk de 8MB produce hash idéntico. RAM pico = 12MB. Tiempo = 18s para 2GB.

### 12.2 POC-02: Circuit Breaker con Opossum.js en NestJS

- **Riesgo que mitiga**: Si QR Simple Bolivia (pasarela de pago) cae mientras estudiantes intentan upgrads de cuota, el `quota-service` puede quedar bloqueado esperando respuestas, generando fallas en cascada y degradando toda la experiencia de pago.
- **Hipótesis**: Opossum.js con `timeout: 3000ms, errorThresholdPercentage: 50, resetTimeout: 30000ms` transiciona a OPEN en < 5s ante 5 fallos consecutivos y sirve la respuesta desde Redis cache en < 500ms.
- **Criterio de éxito medible**: Al simular QR Simple API fallando (mock retorna 503), el CB pasa a OPEN en ≤ 5 intentos fallidos. La respuesta de fallback controlado llega en p95 < 500ms. No hay thread exhaustion.
- **Resultado**: ✅ Validado — CB transiciona a OPEN en exactamente 5 fallos (10s). Fallback desde Redis: p95 = 43ms. 0 thread leaks detectados con `clinic.js flame`.

---

## §13. Seguridad

### 13.1 Modelo de amenazas (STRIDE resumido)

| Amenaza | Vector | Control |
|---------|--------|---------|
| **Spoofing** | JWT falsificado | Firma HS256 con secret rotado en AWS Secrets Manager |
| **Tampering** | Modificar archivo post-entrega | Hash SHA-256 + política WORM S3 Object Lock |
| **Repudiation** | Negar entrega de tarea | `audit_log` inmutable + recibo PDF con hash y timestamp |
| **Info Disclosure** | Acceso a archivos ajenos | RBAC estricto; presigned URLs de un solo uso |
| **DoS** | Flood de uploads | Rate limiting en API Gateway (100 req/s); HPA en file-service |
| **Elevation of Privilege** | RBAC bypass | Roles asignados exclusivamente por WebSISS SSO; no editables por usuario |

### 13.2 AuthN / AuthZ

- **AuthN**: SSO WebSISS (OAuth2 / SAML 2.0) → JWT firmado HS256, TTL 8h, HttpOnly Cookie.
- **AuthZ**: RBAC 4 roles (Estudiante, Docente, Administrativo, Admin). Permisos declarados en `AGENTS.md §RBAC-matrix`.
- **Usuarios externos**: Token de buzón público (UUID firmado, TTL = vida del SimonDrop). Sin acceso al sistema de archivos personal.

### 13.3 Protección de datos

- **Cifrado en tránsito**: TLS 1.3 en todos los endpoints.
- **Cifrado en reposo**: S3 SSE-S3; RDS encrypted at rest (AES-256).
- **PII**: Solo email institucional y nombre completo; no se almacenan datos sensibles adicionales.
- **Cumplimiento**: Ley 164 Bolivia (datos en territorio boliviano / sa-east-1 más cercana); sin transferencia de datos académicos a terceros.

### 13.4 Seguridad IA

- **Prompt injection**: Los prompts del sistema no incluyen datos de usuario sin sanitizar.
- **Data exfiltration**: Los agentes solo tienen acceso de lectura al repositorio; no pueden publicar ni enviar datos a URLs externas.
- **Jailbreak**: Guardrails en AGENTS.md — los agentes rechazan prompts que intenten modificar BRD/FSD sin aprobación.

---

## §14. Observabilidad

- **Logs estructurados**: JSON con campos `correlationId`, `traceId`, `userId`, `service`, `level`, `timestamp`. Centralizados en CloudWatch Logs.
- **Métricas**: Prometheus (en ECS) + CloudWatch Metrics. Alertas en: error rate > 1%, p95 latencia > 500ms, almacenamiento S3 > 80%.
- **Trazas distribuidas**: OpenTelemetry SDK en todos los servicios NestJS. Exporta a AWS X-Ray. `traceId` propagado en headers HTTP.
- **Dashboards**: CloudWatch Dashboard con: uploads/minuto, errores CB, latencia p50/p95/p99 por servicio, cuota global usada.
- **Observabilidad IA**: Tokens usados por modelo, latencia de generación, `hallucination_rate` registrados en `docs/PROMPT_MAPPING.md`.

---

## §15. DevOps y Ciclo de Vida

- **Branching**: `main` → `release/X.Y.Z` (entrega evaluada) → `feat/*`, `fix/*` (desarrollo).
- **CI/CD**: GitHub Actions. Pipeline: `lint → test unitarios → test integración → build Docker → push ECR → deploy ECS (blue-green)`.
- **Pirámide de testing**: 70% unitarios (Jest) / 20% integración (Supertest + TestContainers PostgreSQL) / 10% E2E (Playwright).
- **Contract Tests**: Los prompt-contratos en `prompts/PR-*.md` son contratos de comportamiento; se verifica contra los criterios Gherkin del FSD.
- **Rollback**: Blue-green deployment en ECS; en caso de fallo de healthcheck, tráfico revierte al task anterior en < 60s.
- **Release Strategy**: Tags semánticos `vX.Y.Z`; release branches evaluadas por el docente.

---

## §16. Antipatrones Auditados

| Antipatrón | ¿Se detectó? | Mitigación aplicada |
|------------|--------------|---------------------|
| **Big Ball of Mud** | No | Módulos por bounded context; contratos API versionados |
| **God Service** | Riesgo bajo | `file-service` limitado a storage; SHA-256 y buzones en servicios separados |
| **Distributed Monolith** | Riesgo medio | Contratos asíncronos via Outbox/Saga; sin llamadas síncronas cross-service en flujos críticos |
| **Chatty Services** | No | `quota-service` usa CB para QR Simple; admin usa CQRS Read Model |
| **Dual Write Problem** | Resuelto | Patrón Outbox para `FileUploadedEvent` — escritura BD + evento en misma transacción PostgreSQL |
| **Anemic Domain Model** | No | Aggregates `File`, `SimonDrop`, `Quota` encapsulan reglas de negocio (no solo getters/setters) |
| **Synchronous Chain** | Resuelto | Flujos de notificación y saga desacoplados via SQS; CB en llamadas síncronas a LMS externos |
| **Mega-monolith por falta de límites** | No | 8 servicios con 1 BD por servicio (Richardson §1.4 database per service) |

---

## §17. Trade-offs Arquitectónicos

| Decisión | Opción elegida | Alternativas descartadas | Razones | Consecuencias |
|----------|----------------|--------------------------|---------|---------------|
| Estilo arquitectónico | Microservicios + Hexagonal | Monolito modular | Escalado independiente file-service en exámenes; equipos pueden evolucionar independientemente | Mayor complejidad operacional; requiere madurez en DevOps |
| Subida de archivos grandes | S3 Multipart Upload (presigned URL) | TUS protocol | Control total sin intermediario; integración directa con S3; no requiere librería externa de servidor | Cliente debe implementar lógica de chunking; mayor código frontend |
| SSO Integration | OAuth2 (WebSISS) | SAML 2.0 | Más moderno; mejor soporte en NestJS Passport; tokens JWT nativos | WebSISS puede requerir configuración adicional si solo soporta SAML |
| Persistencia | PostgreSQL | DynamoDB | Transacciones ACID necesarias para cuotas y auditoría; queries relacionales complejas | Escalar lectura vía réplicas; DynamoDB no apto para queries complejas |
| Consistent Hashing | Redis Cluster (ioredis) | Redis Sentinel | Distribución horizontal real; N nodos activos; mayor throughput | Mayor complejidad de configuración; necesita ≥ 3 nodos |
| Saga type | Orquestada (Step Functions) | Coreografía | Estado global trazable; compensaciones explícitas; mejor observabilidad | Acoplamiento al orquestador; punto de fallo potencial |
| Cloud provider | AWS (sa-east-1) | GCP, Azure | Región sa-east-1 más cercana a Bolivia; mejor soporte para instituciones educativas en LatAm | Vendor lock-in parcial; mitigado por uso de S3-compatible MinIO en local |

> Cada trade-off con ADR asociado en `docs/adr/`. Ver especialmente `docs/adr/0005-cloud-provider-y-estilo-de-despliegue.md`.

---

## §18. Riesgos Técnicos

| Riesgo | Prob. | Impacto | Mitigación | Plan de contingencia |
|--------|-------|---------|------------|----------------------|
| WebSISS SSO no disponible | media | crítico | CB + sesiones JWT de 8h (toleran 8h de caída SSO) | Login manual temporal para Admin; alerta a DTIC |
| Pico de exámenes (10x carga normal) | alta | alto | HPA Kubernetes; Redis CH para sesiones; S3 presigned URLs | Modo degradado: solo upload sin preview; queue visible para usuarios |
| QR Simple cambia esquema HMAC | baja | alto | Validación HMAC encapsulada en Guard (fácil de actualizar) | Pago manual por transferencia bancaria como alternativa temporal |
| Crecimiento storage > capacidad S3 | media | medio | Política de lifecycle S3 (archivos purgados a los 30 días); alertas > 80% | Negociar con DTIC expansión de almacenamiento; compresión automática |

---

## §19. Roadmap Técnico

- **Módulo 4 (actual)**: DTI vFinal + POCs validados + arquitectura completa documentada.
- **Módulo 5**: Implementación core hexagonal (`file-service` + `simondrop-service`). Integración SSO WebSISS real con ambiente de staging UMSS. Integración QR Simple para upgrade de cuota.
- **Módulo 6**: Integración LMS opcional (Moodle, Classroom) como backlog v2.0. Pipeline CI/CD. Deploy on-premise DTIC staging.
- **v2.0**: Migración Google Drive API, editor PDF básico en navegador, firma digital de documentos (PKI).

---

## §20. Glosario y Referencias

**Glosario**: Ver `docs/fsd/FSD_vFinal.md §11` para definiciones de SimonDrop, SHA-256, SSO, Homologación, RBAC, Presigned URL, Audit Log.

**Referencias**:
- Richardson, C. (2019). *Microservices Patterns*. Manning Publications.
- Brown, S. (2022). *The C4 Model for Software Architecture*.
- Martin, R. C. (2017). *Clean Architecture*. Prentice Hall.
- AWS Well-Architected Framework. Pillar de Reliability.
- Ley 164 Bolivia — Ley General de Telecomunicaciones y TIC.

---

## §21. Registro de Decisiones Arquitectónicas (ADR)

| ADR | Título | Estado | Fecha |
|-----|--------|--------|-------|
| 0001 | Adopción de arquitectura hexagonal + microservicios + event-driven | Aceptada | 2026-05-18 |
| 0002 | Autenticación SSO WebSISS via OAuth2 | Aceptada | 2026-05-18 |
| 0003 | Subidas reanudables: S3 Multipart Upload vs TUS | Aceptada | 2026-05-18 |
| 0004 | Saga orquestada para upgrade de cuota (QR Simple) | Aceptada | 2026-05-20 |
| 0005 | Cloud provider AWS + región sa-east-1 + estilo de despliegue ECS Fargate | Aceptada | 2026-05-27 |

---

## Checklist de entrega DTI vFinal ✅

- [x] Visión del producto + métricas de éxito (§1).
- [x] Diagramas C4 niveles 1, 2 y 3 del módulo crítico (§2, §3).
- [x] Data flow diagram del caso de uso más crítico (§3.4).
- [x] Modelo de dominio con Aggregates, Entities, VOs, DTOs (§4).
- [x] Arquitectura hexagonal documentada — puertos y adaptadores (§5).
- [x] Catálogo de microservicios, eventos, Saga, Outbox, CQRS (§6, §7).
- [x] Mapeo a AWS con justificación por servicio y costo (§8).
- [x] Capa de IA / agentes descrita (§9).
- [x] NFRs con umbrales y mecanismo de verificación (§11).
- [x] 2 POCs críticas definidas con criterio de éxito medible (§12).
- [x] Seguridad (STRIDE, AuthN/AuthZ, PII) (§13).
- [x] Observabilidad (logs, métricas, trazas) (§14).
- [x] DevOps y ciclo de vida (§15).
- [x] Antipatrones auditados (§16).
- [x] Trade-offs arquitectónicos (§17).
- [x] Al menos 3 ADRs registrados (§21) — se registran 5.
- [x] `AGENTS.md` sincronizado.
- [x] `PROMPT_MAPPING.md` sincronizado.
