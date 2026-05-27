# ADR-0003: Subidas Reanudables — S3 Multipart Upload vs Protocolo TUS

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-18 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/fsd/FSD_vFinal.md §4.2 FSD-UC-002`, `docs/DTI.md §17`, `pocs/POC-01/` |

---

## Contexto

SimonCloud debe soportar subidas de archivos de hasta 2GB+ con capacidad de pausar y reanudar sin perder progreso (FSD-UC-002). El caso crítico: estudiante de ingeniería subiendo video de tesis (2GB) con WiFi universitario inestable. La subida no puede reiniciarse desde cero al perder la conexión. Además, el hash SHA-256 debe calcularse de forma incremental durante la subida.

## Decisión

Usar **S3 Multipart Upload con presigned URLs** generadas por el `file-service`.

1. Cliente solicita inicio de subida → `file-service` crea sesión en PostgreSQL y genera `uploadId` de S3.
2. Por cada chunk (8MB): cliente obtiene presigned URL del `file-service` → PUT directo a S3.
3. Al completar todos los chunks: `file-service` llama `CompleteMultipartUpload` → calcula SHA-256 final.
4. Sesión de progreso almacenada en Redis Cluster (Consistent Hashing por `sessionId`).

## Alternativas consideradas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **TUS Protocol** | Requiere servidor TUS intermedio (tus-node-server). El servidor debe manejar los bytes del archivo, aumentando carga en `file-service`. S3 Multipart sube directamente desde cliente a S3, sin pasar por el servidor. TUS añade dependencia externa con mantenimiento variable. |
| **HTTP Range Requests manuales** | Protocolo no estándar que requiere implementación completa client-side. S3 Multipart ya resuelve la reanudación de forma nativa. |
| **Upload monolítico (sin chunks)** | Un archivo de 2GB en un solo POST agota la RAM del servidor y el timeout del gateway. Imposible reanudar ante fallo de red. |

## Consecuencias

**Positivas**:
- Los bytes del archivo van directo del cliente a S3 (sin pasar por file-service) → menor carga en backend.
- Reanudación nativa: el `uploadId` de S3 persiste; al reconectar se reanuda desde el último chunk exitoso.
- Sin dependencia de librería TUS en el servidor.

**Negativas**:
- El cliente (React) debe implementar la lógica de chunking y gestión de presigned URLs.
- El SHA-256 se calcula en el servidor tras `CompleteMultipartUpload` (no incremental por chunk); validado como aceptable en POC-01.

## Validación

Ver `pocs/POC-01/` — SHA-256 incremental validado: mismo hash que `openssl sha256`, RAM pico < 100MB para archivo de 2GB.
