# Skill: simoncloud-openapi-spec

## Role
Generas `docs/api/openapi.yaml` (OpenAPI 3.1) para SimonCloud desde los UCs del FSD. Enfoque spec-first: el YAML es la fuente de verdad para Swagger UI, NestJS `@nestjs/swagger` decoradores, y documentación de la API pública. Cada endpoint refleja exactamente los datos in/out del FSD y requiere JWT.

## Activation context
Activar cuando: el FSD tiene UCs con datos de entrada/salida definidos y se necesita la especificación OpenAPI antes de implementar o documentar la API. NO activar si los UCs aún no tienen datos definidos.

## Context / Inputs requeridos
- `docs/fsd/FSD_vFinal.md` — UCs con actor, datos in/out, BRs, errores esperados.
- `docs/prd/PRD_vFinal.md §7` — PRD-REQs para descriptions.
- `AGENTS.md` — stack autoritativo (NestJS 10, Swagger/OpenAPI 3.1, JWT Bearer).

## Reasoning (pasos en orden)

1. **§ info + servers**: título, versión (SemVer `1.0.0`), descripción del producto, server `http://localhost:3000` (dev) + server del entorno de staging.
2. **Security scheme**: `bearerAuth` (JWT). Todos los endpoints protegidos excepto `/auth/login` y el endpoint de acceso de Usuario Externo por token temporal.
3. **Tags**: un tag por bounded context: `auth`, `drops`, `expedientes`, `notificaciones`, `pagos`, `admin`.
4. **Por cada UC del FSD**:
   - Determinar verbo HTTP + path desde el disparador del UC.
   - `operationId` = `{verbo}{Recurso}` en camelCase (ej. `createDrop`, `uploadArchivo`).
   - `summary` = título del UC.
   - `description` = citar PRD-REQ-NNN y FSD-UC-NNN.
   - `requestBody` con schema derivado de los datos de entrada del FSD.
   - `responses`: 200/201 (happy path), 400 (validación), 401 (JWT inválido), 403 (rol insuficiente), 404 (recurso no encontrado), 422 (regla de negocio), 500 (error interno).
5. **Schemas en `components/schemas`**: tipos narrow — UUIDs como `string format: uuid`, SHA-256 como `string pattern: "^[a-f0-9]{64}$"`, timestamps como `string format: date-time`, tamaños en bytes como `integer`, montos BOB como `number multipleOf: 0.01`.
6. **Endpoints especiales**:
   - `POST /drops/{dropId}/archivos` — multipart/form-data para upload; declarar `maxLength` por archivo (50 MB = 52428800 bytes).
   - `GET /external/drops/{dropId}/archivos/{archivoId}?token={jwt}` — acceso público para Usuario Externo; sin `bearerAuth`, con `token` como query param firmado.
7. **Validar contra BRs**: si una BR prohíbe algo (ej. "archivo > 50 MB rechazado"), declarar en `responses 422` con `errorCode`.

## Stop condition
Detente cuando: cada UC del FSD tiene al menos 1 operación en el YAML, todos los schemas tienen tipos narrow, y el YAML es válido OpenAPI 3.1.

## Output esperado

`docs/api/openapi.yaml`:

```yaml
openapi: "3.1.0"
info:
  title: SimonCloud API
  version: "1.0.0"
  description: |
    API REST de SimonCloud — plataforma documental UMSS.
    Trazabilidad: SHA-256 de cada archivo, audit log de cada operación.
    Autenticación: JWT Bearer (WebSISS SSO via Auth service).
    Usuario Externo: acceso via token temporal en query param.
servers:
  - url: http://localhost:3000
    description: Dev local (NestJS + PostgreSQL)
  - url: https://simoncloud.umss.edu.bo/api
    description: Producción on-premise UMSS

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    UUID:
      type: string
      format: uuid
      example: "550e8400-e29b-41d4-a716-446655440000"
    SHA256Hash:
      type: string
      pattern: "^[a-f0-9]{64}$"
      example: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    ISO8601DateTime:
      type: string
      format: date-time
      example: "2026-10-15T20:00:00-04:00"

security:
  - bearerAuth: []

tags:
  - name: auth
  - name: drops
  - name: expedientes
  - name: notificaciones
  - name: pagos
  - name: admin

paths:
  /drops:
    post:
      tags: [drops]
      operationId: createDrop
      summary: "FSD-UC-001 — Crear SimonDrop"
      description: "PRD-REQ-001. Crea un buzón de entrega. Requiere rol DOCENTE."
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateDropRequest'
      responses:
        "201":
          description: Drop creado exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DropResponse'
        "400": { description: "Datos de entrada inválidos" }
        "401": { description: "JWT inválido o expirado" }
        "403": { description: "Rol insuficiente" }
        "422": { description: "Regla de negocio violada (ver BR-NNN)" }
```

## Invariantes
- MUST: SHA-256 con `pattern: "^[a-f0-9]{64}$"` — nunca `string` genérico.
- MUST: Todos los endpoints con `security: [{bearerAuth: []}]` excepto login y acceso externo.
- MUST NOT: `double`/`float` para montos BOB — usar `number` con `multipleOf: 0.01`.
- MUST: Upload de archivos como `multipart/form-data` con `maxLength` declarado.
- MUST: `operationId` únicos y en camelCase.
- MUST: Cada endpoint con trazabilidad `FSD-UC-NNN` en `description`.

## Mini ejemplo de invocación
> "Genera el OpenAPI 3.1 YAML de SimonCloud desde FSD_vFinal. Endpoints para: crear Drop, upload archivo, obtener Drop, listar archivos, acceso externo con token temporal. Usa `/project:openapi-spec`."
