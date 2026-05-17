# AGENTS.md

## 1. Identidad del producto
- **Nombre**: SimonCloud
- **Grupo**: Beto (G01)
- **Dominio**: EduTech / GovTech (Universidad Pública)
- **Resumen**: Ecosistema de archivos digitales y gestión documental para la Universidad Mayor de San Simón (UMSS).
- **DTI**: `docs/dti/DTI_borrador.md`
- **FSD**: `docs/FSD_v1.md`
- **PROMPT_MAPPING**: `docs/PROMPT_MAPPINGS.md`

## 2. Contexto que el agente MUST leer antes de actuar
1. `docs/dti/DTI_borrador.md`
2. El FSD del caso de uso tocado por la tarea (`docs/FSD_v1.md`).
3. `docs/PROMPT_MAPPINGS.md` para los contratos de prompts existentes.

## 3. Estructura del repositorio
```
/
├── AGENTS.md                ← este archivo
├── README.md
├── docs/
│   ├── BRD_v2.md
│   ├── MRD.md
│   ├── PRD_v1.md
│   ├── FSD_v1.md
│   ├── PROMPT_MAPPINGS.md
│   ├── dti/
│   └── aportes/
├── old-docs/                ← Contexto histórico UX, auditorías
├── src/
└── tests/
```

## 4. Stack tecnológico autoritativo
| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| Backend | Node.js / NestJS | 10.x | Escalabilidad para gestión de archivos |
| Frontend | React + Vite | 18.x | Performance e interactividad |
| Persistencia | PostgreSQL | 15.x | Integridad referencial y transacciones ACID |
| Almacenamiento| AWS S3 | - | Archivos digitales escalables |

## 5. Convenciones de código
- **Idioma del código**: Inglés.
- **Idioma de la documentación**: Español.
- **Naming**: Clases `PascalCase`, métodos `camelCase`, variables de entorno `UPPER_SNAKE_CASE`.
- **Arquitectura**: Clean Architecture / Ports and Adapters.
- **Commits**: Conventional Commits obligatorios.

## 6. Reglas de dominio invariantes
- **MUST**: Validar autenticación con SSO UMSS antes de cualquier lectura/escritura de archivos.
- **MUST**: Todo documento debe tener trazabilidad de acciones (audit log) y versionado.
- **MUST NOT**: Borrar físicamente documentos oficiales (soft delete con retención obligatoria).

## 7. Capacidades y guardrails de agentes
| Agente | Propósito | Modelo | Herramientas | Límites |
|--------|-----------|--------|--------------|---------|
| `simoncloud-agent` | Desarrollar features y docs | Claude 3.5 Sonnet / Gemini | `read`, `edit`, `run_commands` | No toca credenciales de producción |

- **MUST**: Correr análisis de tipos y linter antes de commits.
- **MUST NOT**: Modificar esquemas de bases de datos de producción sin review manual.

## 8. Comandos locales
```bash
npm run dev        # Servidor de desarrollo
npm run test       # Ejecutar suite de pruebas
npm run lint       # Linter
```

## 9. Registro de cambios de este AGENTS.md
| Versión | Fecha | Autor | Cambio |
|---------|-------|-------|--------|
| v1.0.0 | 2026-05-17 | Beto | Versión inicial alineada a la rúbrica |
