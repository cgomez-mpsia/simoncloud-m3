# PR-IMPL-004 — Slice de autenticación: stub WebSISS + JWT RS256 (FSD-UC-004)

## 0. Metadatos del prompt

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-IMPL-004` |
| Título | Auth habilitante del E2E — stub WebSISS + JWT RS256 + Guard |
| Artefacto origen | Design Doc + ADR |
| ID origen | `FSD-UC-004`, `DD-UC-004`, `ADR-0008`, `ADR-0002` |
| Tipo de prompt | generación (código + tests) |
| Modelo recomendado | Opus / Sonnet |
| Temperatura | 0.1 |
| Versión | v0.1 |
| Fecha | 28/06/2026 |
| Autor(es) | Carlos Alberto Gomez Ormachea |
| Estado | Borrador (no ejecutado — diseño primero) |

## 1. Anatomía del prompt

### 1.1 Role
```text
Eres un Senior Backend Engineer experto en NestJS 10, TypeScript estricto, JWT (RS256),
seguridad y arquitectura hexagonal.
```

### 1.2 Task
```text
Implementa la autenticación habilitante del E2E según docs/design/DD-UC-004.md: un puerto
AuthProviderPort con un StubWebSissAuthProvider (usuarios semilla), emisión de JWT real
RS256 con rol, y un JwtAuthGuard que protege /api/*. Incluye tests Jest con cobertura ≥90%.
```

### 1.3 Context
```text
- Documento fuente: docs/design/DD-UC-004.md; FSD-UC-004; ADR-0008 (stub en v1), ADR-0002.
- Decisión: SSO WebSISS real diferido; v1 = stub detrás de AuthProviderPort, reemplazable
  por WebSissOAuthAdapter sin tocar consumidores. JWT firmado RS256 (clave privada en env/Vault,
  verificación con pública — coherente con DTI §3).
- Roles: ESTUDIANTE | DOCENTE | ADMINISTRATIVO | ADMIN (invariante). El E2E usa DOCENTE.
- Restricciones técnicas: NestJS 10, hexagonal (domain no importa infra; puertos en
  domain/port/out/), JWT en cookie HttpOnly. Secretos NUNCA hardcoded.
```

### 1.4 Reasoning
```text
1. domain/port/out/AuthProviderPort: authenticate(credentials) -> { userId, rol, nombre }.
2. adapter/out/StubWebSissAuthProvider: valida contra usuarios semilla; implementa el puerto.
3. JwtIssuer (RS256, clave privada env) + JwtAuthGuard (verifica con pública).
4. adapter/in/AuthController: POST /api/auth/login -> setea cookie HttpOnly con el JWT.
5. Tests: emisión/verificación JWT, asignación de rol, guard rechaza inválido/expirado, login feliz/falla.
No expongas el razonamiento en el output final.
```

### 1.5 Stop condition
```text
Detente cuando el slice compila (npx tsc), npm test pasa con cobertura ≥90% del slice, o falta
información del DD-UC-004 y debes pedir aclaración (no inventes).
```

### 1.6 Output
```text
Archivos TypeScript del slice auth + specs Jest + (si aplica) migración. Resumen de archivos
generados vs editados a mano y % de cobertura.
```

## 2. Invariantes
- Hexagonal: `domain/` no importa NestJS/JWT lib/infra; el puerto vive en `domain/port/out/`.
- JWT **RS256** (no HS256); clave privada desde env/Vault, **nunca hardcoded** ni en logs.
- Rol ∈ `{ESTUDIANTE, DOCENTE, ADMINISTRATIVO, ADMIN}`.
- El stub es **reemplazable** por el adapter real sin cambiar `application/`/`adapter/in`.
- Cobertura del slice **≥90%**.
- Cita los IDs origen (`FSD-UC-004`, `DD-UC-004`) en el PR.

## 3. Failure modes declarados
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_MISSING_CONTEXT` | falta DD-UC-004 | abortar |
| `E_POLICY_VIOLATION` | hardcodea secreto o usa HS256 | rechazar y reintentar |
| `E_AMBIGUOUS_INPUT` | credenciales/rol ambiguos | pedir aclaración |

## 4. Guardrails
- **MUST**: tests verdes y cobertura ≥90% antes de proponer PR.
- **MUST**: registrar la ejecución en `docs/PROMPT_MAPPING.md`.
- **MUST NOT**: exponer secretos; **MUST NOT**: tocar `docs/baseline/`.

## 5. Trazabilidad
| Origen | ID origen | Este prompt | Consumidor | Artefacto |
|--------|-----------|-------------|------------|-----------|
| FSD + DD + ADR | `FSD-UC-004`, `DD-UC-004`, `ADR-0008` | `PR-IMPL-004` | dev-agent | `src/auth/**`, `tests/auth/**` |

## 6. Pruebas del prompt
- **Feliz**: login con usuario semilla DOCENTE → JWT RS256 válido + cookie + rol correcto.
- **Borde**: JWT a 1s de expirar vs expirado.
- **Adversarial**: JWT con firma alterada / HS256 → guard rechaza (401).

## 9. Revisión humana
| Revisor | Fecha | Veredicto | Notas |
|---------|-------|-----------|-------|
| Carlos A. Gomez | — | pendiente | Ejecutar tras aprobar el diseño |
