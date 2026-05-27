# PR-UC-001 — Generador del Algoritmo de Homologación de Notas

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-001` |
| **Título** | Generador del Algoritmo de Homologación de Notas |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.1 FSD-UC-001` |
| **Tipo** | Generación / Transformación |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.1 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-11 |
| **Estado** | applied |

## Role
```
Eres un Senior Backend Engineer experto en procesamiento de datos
y algoritmos de normalización en TypeScript/Node.js.
```

## Task
```
Implementar la función homologateGrades(moodleData, classroomData)
que consolide dos arreglos de calificaciones heterogéneas en un solo
arreglo estandarizado sobre 100 puntos, unificando a los estudiantes
por su correo electrónico. Reglas BR-001, BR-002, BR-003 y BR-004.
```

## Context
```
- Fuente: FSD-UC-001 en docs/fsd/FSD_vFinal.md
- BR-001: importar calificaciones desde Moodle y Classroom
- BR-002: homologar automáticamente a escala 0-100
- BR-003: deduplicar estudiantes por correo institucional
- BR-004: mantener trazabilidad de fuente original (lms_origen)
- moodleData: Array<{ email: string, moodleScore: number }> (Score /50)
- classroomData: Array<{ email: string, classroomLetter: string }> (A=90, B=75, C=60, D=50, F=0)
- Restricción: TypeScript estricto, sin librerías externas
```

## Reasoning
```
1. Crear Map<string, ConsolidatedGrade> usando email como llave
2. Iterar moodleData: multiplicar score × 2, agregar al Map
3. Iterar classroomData: aplicar tabla de equivalencia de letras, actualizar Map
4. Convertir el Map a Array y retornarlo
No exponer el razonamiento en el output.
```

## Stop Condition
```
Detente cuando la función principal y la función auxiliar de mapeo
de letras estén completas, tipadas y exportadas. No generes tests.
```

## Output Esperado
```typescript
export interface ConsolidatedGrade {
  email: string;
  moodleGrade: number | null;
  classroomGrade: number | null;
  lms_origen: 'Moodle' | 'Classroom' | 'Ambos';
}

export function homologateGrades(
  moodleData: Array<{ email: string; moodleScore: number }>,
  classroomData: Array<{ email: string; classroomLetter: string }>
): ConsolidatedGrade[] { /* implementación */ }
```

## Invariantes
- Salida **debe** aplicar: Moodle /50 → × 2
- Salida **no debe** tener duplicados por email
- Salida **debe** incluir `lms_origen` en cada objeto (BR-004)

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_DUPLICATE_EMAILS` | Emails no unificados | Verificar uso correcto del Map |
| `E_BAD_MATH` | Nota de Moodle no en base 100 | Corregir factor ×2 |
| `E_MISSING_LMS_ORIGEN` | Campo lms_origen ausente | Revisar lógica de fusión |
