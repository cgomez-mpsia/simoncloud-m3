# PROMPT_MAPPINGS.md — Contratos de Prompts de IA

> **Ética y Trazabilidad (AI-SDLC 2027)**: Este archivo sirve como el **Prompt Log Obligatorio** para todo código generado en este repositorio. Bajo el nuevo paradigma, *si no hay prompt log, no hay auditoría, hay leyenda*. Borrar o alterar retroactivamente un prompt de esta bitácora equivale a destrucción de evidencia.
> 
> Las métricas de **Prompt Coverage** del equipo (Target: ≥ 80%) se calculan directamente leyendo la cobertura de los UCs contra este archivo. Todo commit generado debe estar firmado con `git commit -S` y llevar el trailer `Co-authored-by: Claude <noreply@anthropic.com>`.

---

## Índice de Prompts

| ID | Título | Tipo | Artefacto origen | Modelo |
|----|--------|------|-----------------|--------|
| `PR-BRD-001` | Revisor de Coherencia del BRD | Revisión | BRD | Claude Sonnet |
| `PR-UC-001` | Generador del Algoritmo de Homologación | Generación | FSD-UC-001 | Claude Sonnet |
| `PR-UC-002` | Generador de Hash SHA-256 de Entrega | Generación | FSD-UC-002 | Claude Sonnet |

---

## PR-BRD-001 — Revisor de Coherencia del BRD

### Metadatos

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-BRD-001` |
| Título | Revisor de Coherencia y Completitud del BRD |
| Artefacto origen | BRD |
| ID origen | `BRD_v2.md` completo |
| Tipo de prompt | Revisión / Auditoría |
| Modelo recomendado | Claude 3.5 Sonnet |
| Temperatura | 0.2 (baja para análisis consistente) |
| Versión | v1.0 |
| Fecha | 11/05/2026 |

### 1.1 Role
```text
Eres un Senior Business Analyst con 10 años de experiencia validando
Business Requirements Documents para proyectos de software universitario.
Conoces el checklist mínimo del módulo: ≥8 requerimientos de negocio,
Business Model Canvas con ≥3 elementos por bloque, ≥1 North Star KPI,
y ≥3 objetivos SMART.
```

### 1.2 Task
```text
Audita el BRD_v2.md de SimonCloud y produce un reporte de coherencia
que identifique: (a) secciones incompletas, (b) contradicciones internas,
(c) requerimientos sin métrica de aceptación, (d) KPIs sin línea base.
```

### 1.3 Context
```text
- Documento fuente: BRD_v2.md (SimonCloud, UMSS, v2.0)
- Entradas esperadas: el texto completo del BRD en Markdown.
- Restricciones de dominio:
  - BR-001 a BR-008 deben tener justificación y métrica.
  - El BMC debe tener exactamente 9 bloques con ≥3 elementos cada uno.
  - Los KPIs deben tener línea base, meta y horizonte.
- Restricciones técnicas: no inventar información; solo citar lo presente.
```

### 1.4 Reasoning
```text
Sigue estos pasos en orden:
1. Lee el BRD completo sección por sección.
2. Para cada sección, verifica contra el checklist mínimo.
3. Detecta inconsistencias: si un BR referencia un KPI que no existe en §8, márcalo.
4. Genera el reporte estructurado por sección.
No expongas el razonamiento interno en el output.
```

### 1.5 Stop condition
```text
Detente cuando hayas revisado las 20 secciones del BRD.
No continues con sugerencias de redacción; solo reporta gaps.
```

### 1.6 Output
```text
Formato: Markdown con tabla de hallazgos.
```

```markdown
## Reporte de Auditoría BRD_v2.md

| Sección | Estado | Hallazgo | Acción recomendada |
|---------|--------|----------|--------------------|
| §8 KPIs | ⚠️ Incompleto | KPI-02 no tiene línea base. | Agregar valor actual de adopción. |
| §11 BRs | ✅ Completo | 8 requerimientos con métrica. | — |
```

### Invariantes
- La salida **debe** citar la sección exacta (`§N`) de cada hallazgo.
- La salida **no debe** inventar información no presente en el BRD.
- La salida **no debe** exceder 500 palabras.

### Failure modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_MISSING_SECTION` | Una sección numerada no existe en el BRD. | Listarla como "Sección ausente". |
| `E_AMBIGUOUS_BR` | Un requerimiento no tiene métrica. | Marcarlo con ⚠️. |

---

## PR-UC-001 — Generador del Algoritmo de Homologación de Notas

### Metadatos

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-UC-001` |
| Título | Generador del Algoritmo de Homologación de Notas |
| Artefacto origen | FSD |
| ID origen | `FSD-UC-001` |
| Tipo de prompt | Generación / Transformación |
| Modelo recomendado | Claude 3.5 Sonnet / Gemini 1.5 Pro |
| Temperatura | 0.1 (determinístico para código) |
| Versión | v1.0 |
| Fecha | 11/05/2026 |

### 1.1 Role
```text
Eres un Senior Backend Engineer experto en procesamiento de datos
y algoritmos de normalización en TypeScript/Node.js.
```

### 1.2 Task
```text
Implementar la función `homologateGrades(moodleData, classroomData)`
que consolide dos arreglos de calificaciones heterogéneas en un solo
arreglo estandarizado sobre 100 puntos, unificando a los estudiantes
por su correo electrónico. Reglas de negocio BR-001 (importar LMS),
BR-002 (homologar escala), BR-003 (deduplicar) y BR-004 (trazabilidad).
```

### 1.3 Context
```text
- Documento fuente: FSD-UC-001 en docs/FSD_v1.md.
- BRs aplicables (BRD_v2.md §11):
  - BR-001: importar calificaciones desde Moodle y Classroom.
  - BR-002: homologar automáticamente a escala 0-100.
  - BR-003: deduplicar estudiantes por correo institucional.
  - BR-004: mantener trazabilidad de fuente original (`lms_origen`).
- Entradas esperadas:
  - moodleData: Array<{ email: string, moodleScore: number }>
    (Score sobre 50 puntos)
  - classroomData: Array<{ email: string, classroomLetter: string }>
    (Letras: A=90, B=75, C=60, D=50, F=0)
- Restricciones de dominio:
  - Si un estudiante existe en ambos arrays, fusionar en un solo objeto.
  - Si solo existe en uno, los valores faltantes serán null.
  - La salida siempre incluye el atributo `lms_origen` para trazabilidad (BR-004).
- Restricciones técnicas: TypeScript estricto, sin librerías externas.
```

### 1.4 Reasoning
```text
Sigue estos pasos en orden:
1. Crea un Map<string, ConsolidatedGrade> usando email como llave.
2. Itera moodleData: multiplica score × 2, agrega al Map.
3. Itera classroomData: aplica tabla de equivalencia de letras, actualiza Map.
4. Convierte el Map a Array y retórnalo.
No expongas el razonamiento en el output.
```

### 1.5 Stop condition
```text
Detente cuando la función principal y la función auxiliar de mapeo
de letras estén completas, tipadas y exportadas. No generes tests.
```

### 1.6 Output
```typescript
export interface ConsolidatedGrade {
  email: string;
  moodleGrade: number | null;      // sobre 100, null si no tiene nota en Moodle
  classroomGrade: number | null;   // sobre 100, null si no tiene nota en Classroom
  lms_origen: ('Moodle' | 'Classroom' | 'Ambos');
}

export function homologateGrades(
  moodleData: Array<{ email: string; moodleScore: number }>,
  classroomData: Array<{ email: string; classroomLetter: string }>
): ConsolidatedGrade[] {
  // implementación...
}
```

### Invariantes
- La salida **debe** contener exclusivamente código TypeScript válido.
- La salida **debe** aplicar la regla: Moodle sobre 50 → multiplicar × 2.
- La salida **no debe** tener estudiantes duplicados bajo el mismo email.
- La salida **debe** incluir el campo `lms_origen` en cada objeto (BR-004 — trazabilidad de fuente).

### Failure modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_DUPLICATE_EMAILS` | Emails no unificados en el output. | Verificar uso correcto del Map. |
| `E_BAD_MATH` | Nota de Moodle no está en base 100. | Corregir factor de conversión (×2). |
| `E_MISSING_LMS_ORIGEN` | Campo `lms_origen` ausente. | Revisar lógica de fusión. |

---

## PR-UC-002 — Generador de Hash SHA-256 de Entrega

### Metadatos

| Campo | Valor |
|-------|-------|
| ID del prompt | `PR-UC-002` |
| Título | Generador de Hash Inmutable SHA-256 |
| Artefacto origen | FSD |
| ID origen | `FSD-UC-002` |
| Tipo de prompt | Generación |
| Modelo recomendado | Claude 3.5 Sonnet / Gemini 1.5 Pro |
| Temperatura | 0.0 (completamente determinístico) |
| Versión | v1.0 |
| Fecha | 11/05/2026 |

### 1.1 Role
```text
Eres un Security Engineer y Node.js Developer experto en criptografía
y en el módulo nativo crypto de Node.js.
```

### 1.2 Task
```text
Crear un servicio Node.js que reciba un buffer de archivo y devuelva
el hash SHA-256 hexadecimal para ser usado como comprobante inmutable
de entrega (BR-007). El servicio debe ser exportable y sin dependencias externas.
```

### 1.3 Context
```text
- Documento fuente: FSD-UC-002 en docs/FSD_v1.md.
- BRs aplicables (BRD_v2.md §11):
  - BR-007: generar comprobantes de entrega con hash SHA-256.
  - BR-005: archivos en actas cerradas son inmutables.
- Entradas esperadas: fileBuffer: Buffer
- Restricciones técnicas:
  - Usar exclusivamente el módulo nativo `crypto` de Node.js.
  - No usar librerías de npm (bcrypt, sha256-js, etc.).
  - El output debe ser un string hexadecimal de 64 caracteres.
```

### 1.4 Reasoning
```text
Sigue estos pasos:
1. Importar el módulo nativo `crypto`.
2. Crear un hash de tipo 'sha256'.
3. Actualizar el hash con el buffer recibido.
4. Digerir el hash en formato 'hex'.
5. Retornar el string resultante.
```

### 1.5 Stop condition
```text
Detente cuando la función esté completamente tipada y exportada.
No generes tests ni ejemplos de uso adicionales.
```

### 1.6 Output
```typescript
import * as crypto from 'crypto';

/**
 * Genera el hash SHA-256 de un buffer de archivo.
 * Usado como comprobante inmutable de entrega (BR-007).
 * @param fileBuffer - El contenido binario del archivo.
 * @returns string hexadecimal de 64 caracteres.
 */
export function generateFileHash(fileBuffer: Buffer): string {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}
```

### Invariantes
- La salida **debe** utilizar `crypto.createHash('sha256')`.
- La salida **no debe** depender de paquetes externos de npm.
- El output del hash **debe** tener exactamente 64 caracteres hexadecimales.
- La función **debe** ser pura (mismo input → mismo output siempre).

### Failure modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_EXTERNAL_DEP` | Se usó una librería externa de npm. | Rechazar; reimplementar con `crypto`. |
| `E_WRONG_LENGTH` | El hash resultante no tiene 64 chars. | Verificar digest format = 'hex'. |
