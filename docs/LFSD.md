# Lightweight Functional Specification Document (LFSD) – SimonCloud

## 0. Metadatos ⚡🔧

| Campo | Valor |
|-------|-------|
| Producto | SimonCloud |
| Grupo | G01 |
| Versión del documento | v1.0 |
| Fecha | 11/05/2026 |
| Autores | Equipo SimonCloud |
| Estado | Borrador Vivo |
| Modo elegido | LFSD ⚡ |
| Trazabilidad a PRD | `PRD_v1.md` |
| Paradigma de Ingeniería | **AI-SDLC 2027** (Spec Ejecutable + Prompt-Contrato) |

## 1. Resumen ejecutivo ⚡🔧
Documento ágil para iterar rápidamente en los flujos principales de SimonCloud: Homologación de calificaciones de LMS heterogéneos y Subida de archivos con generación de Hash de seguridad.

## 2. Alcance y Tasks ⚡🔧

| Task ID | Descripción | Caso de uso (FSD-UC) | Prompt | Estado |
|---------|-------------|----------------------|--------|--------|
| `T-001` | Lógica de unificación de estudiantes por email | `FSD-UC-001` | `PR-UC-001` | Dev |
| `T-002` | Algoritmo de conversión de escalas (Letras a 100) | `FSD-UC-001` | `PR-UC-001` | Dev |
| `T-003` | Middleware de Hasheo SHA-256 en subida | `FSD-UC-002` | `PR-UC-002` | ToDo |

## 3. Actores del sistema ⚡🔧
- **Docente:** Necesita cruzar datos de notas.
- **Estudiante:** Necesita subir documentos de forma segura.

## 4. Casos de uso funcionales (Core) ⚡🔧

### 4.1 FSD-UC-001 – Motor de Homologación
**Flujo principal:**
1. Recibir Arrays de Moodle (sobre 50) y Classroom (letras).
2. Agrupar por `email`.
3. Aplicar conversor matemático.
4. Devolver Array final unificado.

```gherkin
Dado notas desordenadas de Moodle y Classroom para un estudiante
Cuando el algoritmo de homologación procesa los datos
Entonces devuelve un objeto consolidado numérico sobre 100 puntos y unifica duplicados.
```

### 4.2 FSD-UC-002 – Generación de Hash de Entrega
**Flujo principal:**
1. Recibir buffer de archivo.
2. Calcular Hash SHA-256.
3. Guardar metadatos en DB.

## 5. Reglas de negocio ⚡🔧
| ID | Regla |
|----|-------|
| BR-003 | Estudiantes duplicados en plataformas deben fusionarse en un solo registro usando el email como PK. |
| BR-002 | Las notas de Classroom A,B,C se mapean a 90, 75, 60 respectivamente. |

## 6. Paradigma AI-SDLC 2027 (Operación Agéntica) ⚡🤖
> Acorde al "AI Engineering Blueprint", el código deja de ser la fuente de verdad y pasa a ser un artefacto reproducible (Diapositiva 2). La fuente de verdad es este LFSD junto con `PROMPT_MAPPINGS.md`.

### 6.1 Taxonomía de Autonomía
- **Nivel de Autonomía Objetivo:** **L3 (Agente con Aprobación)**. El agente (Claude) generará planes y tool calls para código, pero un humano aprobará los PRs antes de producción (Approval Gates).
- **Guardrails Arquitectónicos:** Implementación de Rollback en $O(1)$ y un Kill Switch en el orquestador CI/CD.

### 6.2 Métricas del AI-SDLC (Más allá de DORA)
| Métrica | Target | Descripción |
|---------|--------|-------------|
| **Prompt Coverage** | ≥ 80% | Proporción de Specs respaldados por un prompt en `PROMPT_MAPPINGS.md`. |
| **Spec Fidelity** | ≥ 95% | Criterios Gherkin que pasan en el CI/CD usando golden files. |
| **Hallucination Rate** | ≤ 5% | PRs con llamadas a APIs inexistentes o lógica inventada no pedida en Spec. |
| **Reversion Rate** | < 10% | Commits de IA revertidos en los primeros 7 días (evita el "Honeymoon Bias"). |

## 7. Prompts-Contratos y Trazabilidad Ética ⚡🔧
Se utilizará `PROMPT_MAPPINGS.md` como **Prompt Log Obligatorio** para auditoría. Ningún prompt puede ser borrado si generó código (destrucción de evidencia).
Todo commit generado en base a este LFSD debe incluir:
- Metadato: `Co-authored-by: Claude <noreply@anthropic.com>`
- Firma criptográfica del ingeniero (HITL): `git commit -S`

## 9. Trazabilidad M2 (UI/UX) ⚡🔧
| Wireframe M2 | Pantalla FSD | Caso de uso |
|--------------|--------------|-------------|
| `pantalla_consolidacion.png` | `/dashboard/homologador` | `FSD-UC-001` |

## 15. Registro de cambios ⚡🔧
| Versión | Fecha | Cambio |
|---------|-------|--------|
| v1.0 | 11/05/2026 | Creación de LFSD para sprint inicial. |
