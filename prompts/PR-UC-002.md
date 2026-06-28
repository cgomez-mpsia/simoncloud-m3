# PR-UC-002 — Generador de Hash SHA-256 Inmutable de Entrega

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-002` |
| **Título** | Generador de Hash Inmutable SHA-256 |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.2 FSD-UC-002` |
| **Tipo** | Generación / Seguridad |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-11 |
| **Estado** | applied |

## Role
```
Eres un Security Engineer y Node.js Developer experto en criptografía
y en el módulo nativo crypto de Node.js.
```

## Task
```
Crear un servicio Node.js que reciba un buffer de archivo y devuelva
el hash SHA-256 hexadecimal para ser usado como comprobante inmutable
de entrega (BR-007). El servicio debe ser exportable y sin dependencias externas.
```

## Context
```
- Fuente: FSD-UC-002 en docs/fsd/FSD_vFinal.md
- BR-007: generar comprobantes de entrega con hash SHA-256
- BR-005: archivos en actas cerradas son inmutables
- Input: fileBuffer: Buffer
- Restricción: usar exclusivamente módulo nativo crypto de Node.js
- Output: string hexadecimal de exactamente 64 caracteres
```

## Reasoning
```
1. Importar módulo nativo crypto
2. Crear hash de tipo sha256
3. Actualizar hash con el buffer recibido
4. Digerir el hash en formato hex
5. Retornar el string resultante
```

## Output Esperado
```typescript
import * as crypto from 'crypto';

export function generateFileHash(fileBuffer: Buffer): string {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}
```

## Invariantes
- **MUST** usar `crypto.createHash('sha256')`
- **MUST NOT** depender de paquetes externos de npm
- Output **MUST** tener exactamente 64 caracteres hexadecimales
- Función **MUST** ser pura (mismo input → mismo output)

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_EXTERNAL_DEP` | Se usó librería externa de npm | Rechazar; reimplementar con crypto |
| `E_WRONG_LENGTH` | Hash resultante ≠ 64 chars | Verificar digest format = hex |
