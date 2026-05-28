# ADR-0002: Autenticación SSO WebSISS via OAuth2

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-18 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/fsd/FSD_vFinal.md §4.4 FSD-UC-004`, `docs/DTI.md §13.2` |

---

## Contexto

SimonCloud debe autenticar a todos sus usuarios internos (Estudiantes, Docentes, Administrativos, Admins) mediante el sistema de identidad institucional de la UMSS (WebSISS). Adicionalmente, usuarios externos (sin cuenta UMSS) deben poder interactuar con SimonDrops públicos. El sistema WebSISS puede soportar OAuth2 o SAML 2.0 según su configuración.

## Decisión

Integrar con **WebSISS via OAuth2 Authorization Code Flow** con tokens JWT internos de corta vida (8 horas).

- WebSISS actúa como Authorization Server.
- `auth-service` intercambia el código OAuth2 por tokens de WebSISS y emite un JWT propio firmado HS256.
- El JWT se almacena en cookie HttpOnly (previene XSS).
- Usuarios externos (FSD-UC-011) reciben un token temporal firmado con HMAC-SHA256, TTL máximo 72h configurable por el docente. El endpoint `/external/drops/:id/archivos?token=<hmac>` retorna 403 sin revelar el recurso si el token es inválido o expirado (BR-011).

## Alternativas consideradas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **SAML 2.0** | Más complejo de implementar en NestJS (librería `passport-saml` tiene menos mantenimiento). XML parsing más frágil que JSON. OAuth2 es el estándar moderno para SaaS. |
| **Credenciales propias (usuario/contraseña SimonCloud)** | Viola el requisito de soberanía de identidad UMSS (R-02). Crea duplicación de cuentas. Requiere gestión de contraseñas adicional. |
| **API Key estática** | No soporta roles dinámicos ni expiración. No adecuado para usuarios finales. |

## Consecuencias

**Positivas**:
- Un solo punto de autenticación para toda la UMSS.
- Roles asignados automáticamente desde WebSISS (sin gestión manual en SimonCloud).
- JWT de corta vida (8h) limita ventana de robo de tokens.

**Negativas**:
- Dependencia crítica en WebSISS (mitigada por CB y sesiones JWT que toleran 8h de caída SSO).
- Si WebSISS solo soporta SAML 2.0, requiere adapter adicional.

## Notas de implementación

```
WebSISS → OAuth2 Code → auth-service → JWT (HS256, 8h) → HttpOnly Cookie
```

Secret almacenado en Docker Secrets / HashiCorp Vault (on-premise DTIC-UMSS, ver ADR-0005). Rotación semestral.
