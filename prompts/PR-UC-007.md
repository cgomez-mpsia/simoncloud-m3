# PR-UC-007 — GET /archivos/:id/versiones — Historial de Versiones

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-007` |
| **Título** | Endpoint de historial de versiones de un archivo |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.5 FSD-UC-005` |
| **Tipo** | Generación / API REST |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Backend Engineer experto en NestJS 10, Prisma 5 y diseño
de APIs REST para sistemas de gestión documental con versionado.
```

## Task
```
Crear el endpoint GET /api/archivos/:id/versiones que retorna el historial
de versiones de un archivo, ordenado del más reciente al más antiguo,
con sha256Hash, tamaño, fecha de subida y URL pública de cada versión.
```

## Context
```
- Fuente: FSD-UC-005 en docs/fsd/FSD_vFinal.md
- Stack: NestJS 10, Prisma 5, PostgreSQL 16
- Auth: JwtAuthGuard — solo el propietario o docente puede ver versiones
- Modelo: FileVersion con fileId, versionNumber, storageKey, sha256Hash, sizeBytes, uploadedAt
- Response: array ordenado desc por versionNumber
```

## Reasoning
```
1. Guard: verificar JWT + ownership (o role DOCENTE)
2. Prisma: findMany FileVersion where fileId = :id, orderBy versionNumber desc
3. Mapear cada versión a DTO con publicUrl computada desde storageKey
4. Retornar array; 404 si el archivo padre no existe
```

## Output Esperado
```typescript
@Get('archivos/:id/versiones')
@UseGuards(JwtAuthGuard)
async getVersions(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
  return this.fileService.getVersionHistory(id, user.sub, user.role);
}
```

## Invariantes
- **MUST** ordenar por `versionNumber DESC`
- **MUST** incluir `sha256Hash` en cada versión
- **MUST** retornar 404 si el archivo no existe o el usuario no tiene acceso

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_NO_AUTH_CHECK` | Retorna versiones sin verificar ownership | Vulnerabilidad de acceso; agregar guard |
| `E_NO_ORDER` | Versiones en orden arbitrario | Agregar `orderBy: { versionNumber: 'desc' }` |
