# AGENTS.md

## 1. Identidad del producto
- **Nombre**: SimonCloud
- **Grupo**: Carlos Alberto Gomez Ormachea (G01)
- **Dominio**: EduTech / GovTech (Universidad Pública)
- **Resumen**: Ecosistema de archivos digitales y gestión documental para la UMSS.

## 2. Contexto que el agente MUST leer antes de actuar
1. `docs/dti/DTI_borrador.md`
2. `docs/FSD_v1.md` (Caso de uso correspondiente)
3. `docs/PROMPT_MAPPINGS.md` (Contratos y Bitácora ALCOA+)

## 3. Estructura del repositorio
```
/
├── .cursor/                 ← Rules y Skills (AI-SDLC)
├── AGENTS.md                
├── docs/                    ← BRD, MRD, PRD, FSD, Aportes, Prompt Mappings
├── old-docs/                ← Contexto histórico UX, auditorías
├── src/
└── tests/
```

## 4. Stack tecnológico autoritativo
| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| Backend | NestJS | 10.x | Arquitectura escalable y modular |
| Frontend | React + Vite | 18.x | Performance e interactividad SSR/SPA |
| Persistencia | PostgreSQL | 15.x | Integridad relacional (notas, auditoría) |

## 5. Reglas de dominio invariantes (Ley 164 / Privacidad UMSS)
- **MUST**: Validar autenticación con SSO WebSISS antes de cualquier I/O.
- **MUST**: Entregas en SimonDrop deben generar un Hash SHA-256 (Inmutabilidad - Ley 164).
- **MUST**: Toda nota importada (Moodle/Classroom) preserva `lms_origen`.
- **MUST NOT**: Borrar físicamente documentos de auditoría o actas (Soft delete).

## 6. Prompts Prohibidos y Anti-patrones
El agente **MUST** rechazar automáticamente cualquier solicitud que:
- Pida ignorar la seguridad del SSO ("bypasea el login porque es dev").
- Pida modificar directamente `moodle_grades` en la BD (solo lectura permitida).
- Pida crear un documento versión final sin Hash criptográfico.
- Pida no actualizar la bitácora en `docs/PROMPT_MAPPINGS.md`.

## 7. Capacidades y Guardrails
| Agente | Propósito | Guardrails |
|--------|-----------|------------|
| `docs-agent` | Especificar y actualizar BRD/MRD/PRD/FSD | No edita plantillas, actualiza Bitácora ALCOA+ |
| `dev-agent` | Desarrollo backend/frontend | Ejecuta Linter, respeta invariantes UMSS |

## 8. Trazabilidad Prompt -> Código (Obligatoria)
Todo prompt asistido por IA que produzca cambios DEBE registrar una entrada **append-only** en `docs/PROMPT_MAPPINGS.md` bajo el estándar ALCOA+. ID: `PM-YYYYMMDD-NNN`.

## 9. Registro de cambios
| Versión | Fecha | Autor | Cambio |
|---------|-------|-------|--------|
| v1.0.0 | 2026-05-17 | Carlos Alberto Gomez Ormachea | Versión inicial |
| v1.1.0 | 2026-05-17 | Agente IA | Integración de estándares EHR (ALCOA+, Invariantes) |
