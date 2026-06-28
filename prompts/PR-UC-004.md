# PR-UC-004 — Cronjob Purga de Papelera (30 días)

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-004` |
| **Título** | Tarea programada para purga de archivos eliminados |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.9 FSD-UC-009` |
| **Tipo** | Generación / Background Job |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Backend Engineer experto en NestJS @nestjs/schedule, Prisma 5
y operaciones atómicas sobre MinIO S3-compatible.
```

## Task
```
Crear un servicio NestJS con @Cron que se ejecuta diariamente a las 02:00 AM,
busca archivos con status='DELETED' y deletedAt < now() - 30 días,
elimina los objetos de MinIO y luego borra los registros de PostgreSQL.
```

## Context
```
- Fuente: FSD-UC-009 en docs/fsd/FSD_vFinal.md
- Tabla: files con campos status: String, deletedAt: DateTime?
- Stack: @nestjs/schedule, @aws-sdk/client-s3, PrismaService
- Restricción: eliminar primero de MinIO, luego de BD (no al revés)
- Batch size: 100 registros por ejecución para evitar timeouts
```

## Reasoning
```
1. @Cron('0 2 * * *') — ejecutar a las 02:00 AM diariamente
2. Prisma: findMany status=DELETED AND deletedAt < 30d, take 100
3. Para cada archivo: DeleteObjectCommand en MinIO
4. Prisma: deleteMany por IDs del batch
5. Log de cuántos archivos purgados
```

## Output Esperado
```typescript
@Cron('0 2 * * *')
async purgeDeletedFiles(): Promise<void> {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const files = await this.prisma.file.findMany({
    where: { status: 'DELETED', deletedAt: { lt: cutoff } },
    take: 100,
  });
  for (const file of files) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: file.storageKey }));
  }
  await this.prisma.file.deleteMany({ where: { id: { in: files.map(f => f.id) } } });
}
```

## Invariantes
- **MUST** eliminar de MinIO ANTES de borrar de BD
- **MUST** usar batch (máximo 100) para evitar lock de tabla
- **MUST NOT** borrar archivos con status ≠ 'DELETED'

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_MINIO_BEFORE_DB` | BD borrada antes que MinIO | Orphan object; reintentar en siguiente run |
| `E_NO_BATCH` | findMany sin take | Riesgo de OOM en tablas grandes |
