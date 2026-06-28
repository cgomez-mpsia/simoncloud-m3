# PR-UC-001 — Generador del Servicio LTI Deep Linking (createLtiDeepLink)

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-001` |
| **Título** | Generador del Servicio LTI Deep Linking — createLtiDeepLink |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.1 FSD-UC-001` |
| **Tipo** | Generación / Transformación |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.1 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-11 |
| **Estado** | applied |

## Role
```
Eres un Senior Backend Engineer experto en integración de sistemas LMS
y el estándar LTI 1.3 con TypeScript/NestJS.
```

## Task
```
Implementar el método createLtiDeepLink(params: LtiDeepLinkParams): Promise<string>
en el LtiDeeplinkService de NestJS que genere un JWT firmado con RS256 para
responder al flujo LTI 1.3 Deep Linking (content-item selection) de un LMS
externo (Moodle / Google Classroom).
```

## Context
```
- Fuente: FSD-UC-001 en docs/fsd/FSD_vFinal.md
- BR-001: el docente puede crear un SimonDrop directamente desde el LMS
- BR-005: la integración sigue el estándar LTI 1.3 (IMS Global)
- El servicio reside en apps/lms-connector/src/deeplink/lti-deeplink.service.ts
- La clave privada RSA está en HashiCorp Vault / Docker Secrets (nunca hardcoded)
- El JWT resultante debe llevar claim "https://purl.imsglobal.org/spec/lti-dl/claim/content_items"
- Parámetros de entrada: dropId, titulo, descripcion, docenteId, lmsAssignmentId (nullable)
- El iss del JWT es la URL canónica de SimonCloud (configurable por env)
```

## Reasoning
```
1. Construir el payload JWT con los claims LTI 1.3 obligatorios
2. Incluir el content_item de tipo ltiResourceLink apuntando al dropId
3. Firmar con RS256 usando la private key de Vault
4. Retornar el JWT como string para redirigir al LMS
No exponer el razonamiento en el output.
```

## Stop Condition
```
Detente cuando el método createLtiDeepLink y su tipo LtiDeepLinkParams
estén completos, tipados, exportados e inyectables como NestJS Service.
No generes tests ni mocks.
```

## Output Esperado
```typescript
export interface LtiDeepLinkParams {
  dropId: string;
  titulo: string;
  descripcion: string;
  docenteId: string;
  lmsAssignmentId: string | null;
  deploymentId: string;
  returnUrl: string;
}

@Injectable()
export class LtiDeeplinkService {
  constructor(private readonly config: ConfigService) {}

  async createLtiDeepLink(params: LtiDeepLinkParams): Promise<string> {
    /* implementación JWT RS256 con claims LTI 1.3 */
  }
}
```

## Invariantes
- El JWT **debe** incluir claim `https://purl.imsglobal.org/spec/lti-dl/claim/content_items`
- El algoritmo de firma **debe** ser RS256 (nunca HS256 para LTI)
- La private key **nunca** debe estar hardcodeada; siempre desde ConfigService
- `lmsAssignmentId` puede ser null (SimonDrop sin asignación LMS)

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_VAULT_KEY_MISSING` | Private key no encontrada en Vault/Secrets | Verificar montaje de Docker Secret |
| `E_INVALID_RETURN_URL` | returnUrl malformada | Validar con zod antes de firmar |
| `E_LTI_CLAIM_MISSING` | JWT sin content_items claim | Revisar construcción del payload |
