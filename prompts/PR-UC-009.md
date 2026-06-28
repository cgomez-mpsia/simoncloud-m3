# PR-UC-009 — Export PDF Audit Log con Streaming

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-009` |
| **Título** | Exportación de audit log en PDF con streaming |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.10 FSD-UC-010` |
| **Tipo** | Generación / Reporting |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Backend Engineer experto en NestJS, generación de PDFs con pdfkit
y streaming HTTP para evitar bufferizar archivos grandes en memoria.
```

## Task
```
Crear el endpoint GET /api/admin/audit-log/export que genere un PDF del
audit log filtrado por rango de fechas, usando pdfkit con pipe directo
al Response de NestJS — sin guardar el PDF en disco ni en memoria completa.
```

## Context
```
- Fuente: FSD-UC-010 en docs/fsd/FSD_vFinal.md
- Stack: NestJS 10, pdfkit, Prisma 5
- Auth: JwtAuthGuard + RoleGuard('ADMIN')
- Query params: startDate, endDate (ISO 8601)
- Tabla: AuditLog con userId, action, resourceId, timestamp, ipAddress
- Response: Content-Type: application/pdf, Content-Disposition: attachment
```

## Reasoning
```
1. Guard: verificar JWT + role ADMIN
2. Prisma: findMany AuditLog where timestamp between startDate y endDate
3. Crear PDFDocument con pdfkit
4. Set headers: Content-Type, Content-Disposition
5. doc.pipe(res) — stream directo a HTTP response
6. Iterar registros y escribir en PDF
7. doc.end() para cerrar stream
```

## Output Esperado
```typescript
@Get('admin/audit-log/export')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
async exportAuditLogPdf(@Query() query: AuditLogQueryDto, @Res() res: Response) {
  const logs = await this.auditService.findByDateRange(query.startDate, query.endDate);
  res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="audit-log.pdf"' });
  const doc = new PDFDocument();
  doc.pipe(res);
  logs.forEach(log => doc.text(`[${log.timestamp}] ${log.userId} — ${log.action} — ${log.resourceId}`));
  doc.end();
}
```

## Invariantes
- **MUST** usar `doc.pipe(res)` — nunca bufferizar el PDF completo
- **MUST** requerir role ADMIN
- **MUST** incluir Content-Disposition: attachment para forzar descarga

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_BUFFER_PDF` | `doc.end()` y luego `res.send(buffer)` | OOM con logs grandes; usar pipe |
| `E_NO_ROLE_GUARD` | Endpoint accesible por cualquier rol | Datos sensibles expuestos; agregar RolesGuard |
