# PR-UC-003 — Stream Google Drive → MinIO S3-Compatible

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-003` |
| **Título** | Importación de archivos desde Google Drive a MinIO |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.8 FSD-UC-008` |
| **Tipo** | Generación / Integración |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Backend Engineer experto en Node.js streams, Google Drive API v3
y AWS SDK v3 para S3-compatible storage (MinIO).
```

## Task
```
Crear un servicio NestJS que reciba un fileId de Google Drive y un
destino en MinIO, y transfiera el archivo sin bufferizar en memoria:
stream directo de Drive hacia S3 usando pipe().
```

## Context
```
- Fuente: FSD-UC-008 en docs/fsd/FSD_vFinal.md
- Stack: @google/googleapis, @aws-sdk/client-s3, NestJS 10
- Restricción: NO cargar el archivo completo en RAM (archivos hasta 5GB)
- Patrón: stream pipe — readable de Drive → PassThrough → PutObjectCommand
- MinIO endpoint: variable MINIO_ENDPOINT en ConfigService
```

## Reasoning
```
1. Obtener stream de descarga desde Drive API (alt: media)
2. Crear PassThrough stream para pipe
3. Iniciar PutObjectCommand con Body = PassThrough stream
4. Pipe de Drive readable → PassThrough
5. Resolver promise cuando upload complete
```

## Output Esperado
```typescript
async streamDriveToMinio(fileId: string, storageKey: string): Promise<void> {
  const driveStream = await this.driveClient.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  const pass = new PassThrough();
  await this.s3.send(new PutObjectCommand({
    Bucket: this.bucket, Key: storageKey, Body: pass,
  }));
  driveStream.data.pipe(pass);
}
```

## Invariantes
- **MUST NOT** cargar el archivo completo en Buffer
- **MUST** usar streaming con PassThrough
- **MUST** manejar error de Drive desconectado sin leak de stream

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_BUFFER_LOAD` | Se usa `Buffer.from(response.data)` | Rechazar; usar stream |
| `E_NO_PIPE` | Upload termina antes que el stream | Verificar await correcto |
