# PR-UC-006 — Middleware de Validación HMAC-SHA256 para Webhook QR Simple

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-006` |
| **Título** | Middleware de Validación HMAC-SHA256 para Webhook QR Simple |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.3 FSD-UC-003` |
| **Tipo** | Generación / Seguridad |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Security Backend Engineer experto en NestJS y criptografía aplicada.
Conoces los timing attacks en comparación de firmas y las mejores prácticas
de validación de webhooks según la especificación de QR Simple Bolivia.
```

## Task
```
Implementar un NestJS Guard que valide la firma HMAC-SHA256 de los webhooks
entrantes de QR Simple antes de procesar el payload de pago. Si la firma
es inválida, rechazar con 401 sin revelar detalles del error.
```

## Context
```
- Fuente: FSD-UC-003 en docs/fsd/FSD_vFinal.md
- BRs: BR-010 (QR Simple), BR-006 (RBAC seguridad)
- Secret key en variable de entorno QR_SIMPLE_WEBHOOK_SECRET
- Header de firma: x-qrsimple-signature: sha256=<hex_digest>
- rawBody debe leerse sin parsear (Buffer)
- Restricción: usar exclusivamente módulo nativo crypto de Node.js
```

## Reasoning
```
1. Crear NestJS Guard que implemente CanActivate
2. Leer header x-qrsimple-signature y extraer hex_digest
3. Leer rawBody del request (Buffer)
4. Calcular HMAC-SHA256 del rawBody usando el secret de .env
5. Comparar con crypto.timingSafeEqual para evitar timing attacks
6. Si coinciden, retornar true; si no, lanzar UnauthorizedException
```

## Output Esperado
```typescript
@Injectable()
export class QrSimpleWebhookGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const signature = req.headers['x-qrsimple-signature'];
    const hex = signature.slice(7);
    const expected = crypto.createHmac('sha256', process.env.QR_SIMPLE_WEBHOOK_SECRET!)
      .update(req.rawBody as Buffer).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(hex, 'hex'), Buffer.from(expected, 'hex')))
      throw new UnauthorizedException();
    return true;
  }
}
```

## Invariantes
- Firma **MUST** validarse con `crypto.timingSafeEqual`
- Secret **MUST NOT** aparecer en logs ni en respuestas de error
- `rawBody` **MUST** ser Buffer sin parsear
- Retornar siempre 401 genérico; **MUST NOT** revelar detalles del fallo

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_SIGNATURE_MISMATCH` | HMAC calculado difiere del header | UnauthorizedException genérica |
| `E_MISSING_HEADER` | Header x-qrsimple-signature ausente | UnauthorizedException |
| `E_RAW_BODY_EMPTY` | req.rawBody es undefined | Verificar config bodyParser con verify callback |
