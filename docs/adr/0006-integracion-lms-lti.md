# ADR-0006: Integración LMS vía LTI 1.3 (Moodle) + OAuth2 (Google Classroom)

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-27 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/fsd/FSD_vFinal.md §4.1 FSD-UC-001`, `docs/roadmap.md §Hito 2` |

---

## Contexto

SimonCloud necesita integrarse con los LMS que usan docentes y estudiantes de la UMSS (Moodle institucional y Google Classroom). El objetivo **no es** leer calificaciones — es que SimonCloud aparezca como **opción de entrega** dentro del LMS, al nivel de "Archivo", "Enlace" o "Google Doc".

El flujo deseado:

1. Docente crea una tarea en Moodle/Classroom.
2. Docente va a SimonCloud, sincroniza sus cursos y crea un **SimonDrop vinculado** a esa tarea.
3. SimonCloud genera un **deep link** que el LMS registra como opción de entrega.
4. Estudiante abre la tarea en el LMS → ve "Entregar en SimonDrop" → sube el archivo directamente en SimonCloud.
5. SimonCloud emite comprobante SHA-256 y notifica al LMS que la entrega fue recibida.

---

## Decisión

### Para Moodle UMSS: **LTI 1.3 (IMS Global Standard)**

LTI (Learning Tools Interoperability) 1.3 es el estándar de la industria para integrar herramientas externas en LMS. Moodle lo soporta nativamente desde la versión 3.7.

**Flujo técnico LTI 1.3**:
```
1. DTIC registra SimonCloud como "External Tool" en Moodle (una sola vez)
   → SimonCloud recibe client_id + deployment_id + platform_url
2. Docente crea tarea → selecciona "External Tool: SimonCloud" → LTI Deep Link
   → SimonCloud recibe context (course_id, assignment_id, user_id) firmado con JWT RS256
3. SimonCloud crea SimonDrop vinculado y devuelve Deep Link URL al LMS
4. Estudiante abre tarea → LMS lanza SimonCloud con JWT de contexto
5. Al recibir entrega → SimonCloud llama LTI AGS (Assignment and Grade Services)
   → Moodle marca tarea como "Entregada"
```

**Bibliotecas**: `@ltijs/ltijs` (Node.js) — librería madura para LTI 1.3 providers.

### Para Google Classroom: **OAuth2 + Classroom API (Phase 1) → Google Add-on (Phase 2)**

Google Classroom **no soporta LTI 1.3** directamente para submissions. El camino es:

**Phase 1 (Módulo 5)**: OAuth2 del docente → SimonCloud lee cursos y tareas vía Classroom API → crea SimonDrop con link. El docente copia el link en la tarea de Classroom como "Material". Limitado pero funcional.

**Phase 2 (v2.0)**: Google Classroom Add-on. Requiere:
- Aplicación registrada en Google Workspace Marketplace
- Revisión y aprobación de Google (proceso de semanas)
- Permite aparecer nativamente como opción de entrega al nivel de "Google Doc"

La Phase 1 no requiere aprobación de Google y da valor inmediato. La Phase 2 es el objetivo final pero fuera del alcance de Módulo 5.

---

## Alternativas consideradas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **Deep link manual sin LTI** | Docente copia URL de SimonDrop en la tarea del LMS. Funciona pero no hay contexto automático (student_id, assignment_id). La entrega no se marca automáticamente en el LMS. |
| **Plugin Moodle nativo (PHP)** | Requiere desarrollo PHP + aprobación del plugin en el repositorio de Moodle. Más acoplado a una versión específica de Moodle. LTI es más portable. |
| **Leer calificaciones (grade pull)** | Invierte el flujo — SimonCloud lee notas del LMS. No añade valor: el docente ya ve las notas en su LMS. Descartado como scope creep. |
| **IFrame embedding sin LTI** | Sin firma JWT, SimonCloud no puede verificar la identidad del estudiante ni el contexto de la tarea. Inseguro. |

---

## Consecuencias

**Positivas**:
- LTI 1.3 es el estándar que usa Turnitin, Khan Academy, H5P — docentes ya lo conocen.
- Moodle en la DTIC-UMSS soporta LTI 1.3 nativamente — no requiere plugins adicionales.
- El flujo es seguro: JWT RS256 firmado por el LMS, verificado por SimonCloud.
- `lms_assignment_id` + `lms_course_id` en el SimonDrop permite trazabilidad bidireccional.
- LTI AGS notifica automáticamente al LMS cuando el estudiante entrega — cero fricción.

**Negativas / riesgos**:
- **Dependencia DTIC**: La DTIC debe registrar SimonCloud como External Tool en Moodle. Es un paso de configuración administrativo, no técnico, pero requiere coordinación.
- **Google Classroom Phase 2**: El programa de Add-ons de Google tiene burocracia de aprobación. Phase 1 (OAuth2 link) es el fallback funcional para Classroom en Módulo 5.
- **LTI 1.3 complejidad**: El handshake LTI implica OIDC Connect + PKCE + JWT RS256. La librería `@ltijs/ltijs` abstrae la complejidad, pero requiere configuración cuidadosa de las claves públicas del LMS.

---

## Implementación (Módulo 5)

**Nuevo servicio**: `lms-connector` (NestJS)

```
apps/lms-connector/
  ├── src/
  │   ├── lti/           ← LTI 1.3 provider (ltijs)
  │   ├── oauth2/        ← OAuth2 Classroom
  │   ├── sync/          ← Sincronización cursos/tareas
  │   └── deeplink/      ← Generación de deep links SimonDrop
  └── README.md
```

**Dependencia de SimonCloud existente**: `lms-connector` llama a `simondrop-service` para crear SimonDrops; hereda autenticación de `auth-service`.

**Prerequisito organizacional**: Coordinación con DTIC-UMSS para obtener `client_id` LTI de la instancia Moodle institucional.
