# Business Requirements Document (BRD) – SimonCloud

> **⚠️ VERSIÓN SUPERSEDIDA (v2.0)** — Documento histórico. El canónico vigente es `docs/brd/BRD_vFinal.md` (v3.0). La propuesta de valor fue reenfocada en v3.0: "homologación automática de calificaciones" → "integración LMS vía SimonDrop LTI 1.3 + SHA-256".

> **Propósito del BRD**: formalizar las necesidades y restricciones de negocio que justifican la existencia del producto, independientemente de la solución técnica. Responde a **"¿qué necesita el negocio y por qué?"**.

---

## 0. Metadatos

| Campo | Valor |
|-------|-------|
| Producto | SimonCloud |
| Grupo | G01 |
| Versión | v2.0 |
| Fecha | 11/05/2026 |
| Sponsor de negocio | DTIC – Dirección de Tecnologías de Información y Comunicación, UMSS |
| Stakeholders | DTIC, Docentes UMSS, Estudiantes UMSS, Personal Administrativo, Equipo de Desarrollo |
| Autores | Carlos Alberto Gomez Ormachea |
| Revisores | Docente + 1 grupo par |
| Estado | Borrador |
| Insumo del Módulo Anterior (M2 UI/UX) | `old-docs/Trabajo de Campo_ Investigación UX - Proyecto SimonCloud.txt`, `old-docs/Auditoría y Rediseño Estructural del Ecosistema de Archivos UMSS.txt` |
| Prompts utilizados | `PR-BRD-001` (ver `docs/PROMPT_MAPPINGS.md`) |

---

## 1. Resumen ejecutivo

Los docentes de la Universidad Mayor de San Simón (UMSS) gestionan hoy sus calificaciones en múltiples plataformas de aprendizaje (Moodle, Google Classroom) con escalas heterogéneas, y deben consolidar manualmente esos datos en hojas de cálculo para producir las actas finales oficiales. Este proceso consume varias horas por docente por semestre, genera errores de duplicación de alumnos y carece de trazabilidad legal.

**SimonCloud** es una plataforma web multi-tenant de gestión académica y almacenamiento institucional que centraliza, sincroniza y homologa automáticamente las calificaciones provenientes de distintos LMS en una sola libreta unificada, con comprobantes de entrega inmutables (SHA-256) y control de acceso por roles.

**Valor esperado:**
- Reducción de ≥ 80 % en el tiempo que los docentes dedican a cruzar y homologar notas manualmente.
- 0 % de alumnos duplicados en planillas consolidadas.
- Eliminación de errores de transcripción en actas finales oficiales.

**Métricas clave de éxito:**
- Tiempo medio de generación de planilla consolidada: de ~4 h → ≤ 5 min.
- Tasa de error en actas finales: de X % → 0 %.
- Adopción en UMSS: ≥ 5 materias piloto en el primer semestre.

**Llamada a la acción:** Se requiere que la DTIC formalice el convenio institucional de uso de SimonCloud, provea acceso a la base de usuarios UMSS y apruebe la tabla de equivalencias de escalas de calificación para habilitar la homologación automática.

---

## 2. Contexto del negocio

- **Organización**: Universidad Mayor de San Simón (UMSS), Bolivia.
- **Unidad impactada**: Dirección de Tecnologías de Información y Comunicación (DTIC); Dirección Académica; Facultades con uso activo de LMS.
- **Procesos de negocio afectados**:
  - Gestión y consolidación semestral de calificaciones.
  - Generación y validación de actas finales oficiales.
  - Distribución de material académico y entrega de tareas.
- **Estrategia vinculada**: La UMSS busca la modernización y digitalización de sus procesos académico-administrativos, reduciendo la dependencia de herramientas no institucionales (Excel, Drive personal) y garantizando la soberanía digital de la información de sus estudiantes y docentes.

---

## 3. Problema y oportunidad de negocio

### 3.1 Problema

Los docentes universitarios de la UMSS dictan materias apoyándose simultáneamente en más de un Sistema de Gestión del Aprendizaje (LMS): Moodle (calificaciones sobre 50 puntos) y Google Classroom (calificaciones con letras A–F). Al cierre de cada semestre, deben exportar manualmente los datos de cada plataforma, convertirlos a la escala oficial (0–100), cruzar las listas de alumnos para evitar duplicados y consolidar todo en una hoja de cálculo propia antes de entregar el acta a la Dirección Académica.

Este proceso presenta cuatro síntomas críticos: (1) **alto costo en tiempo** —se estiman entre 2 y 6 horas por docente por semestre solo en cruce y homologación—; (2) **errores de duplicación** —alumnos registrados con formatos de nombre distintos en cada LMS aparecen dos veces en la planilla—; (3) **pérdida de trazabilidad** —una vez trasladada la nota a Excel, se desconoce si proviene de Moodle o Classroom—; (4) **riesgo legal y académico** —un acta entregada con datos incorrectos requiere un proceso administrativo oneroso para su corrección una vez cerrada.

La consecuencia de no actuar es la perpetuación de un sistema propenso a errores humanos que afecta directamente la confiabilidad de los registros académicos oficiales de la universidad.

### 3.2 Oportunidad

- **Valor operativo**: Liberando al menos 3 horas por docente por semestre en una universidad con 500 docentes activos, SimonCloud representa un ahorro de ~1 500 horas/semestre de trabajo calificado.
- **Valor estratégico**: Posiciona a la UMSS como pionera en soberanía digital académica en Bolivia, con infraestructura propia frente a soluciones de terceros (Google, Microsoft) que no se alinean al reglamento de datos de instituciones públicas bolivianas.
- **Ventana de oportunidad**: La creciente adopción de LMS post-pandemia y la ausencia de una solución local de homologación crean una ventana de adopción temprana. Expandirse a otras universidades bolivianas antes de que actores internacionales consoliden su presencia es el horizonte estratégico de los próximos 2 años.

### 3.3 Evidencia de Continuous Discovery (M2)

> Esta sección vincula el BRD al track de Discovery del M2 (UI/UX). Los datos provienen de la investigación de campo real ejecutada con 15 participantes de la UMSS.

- **Documentos fuente**: `old-docs/Trabajo de Campo_ Investigación UX - Proyecto SimonCloud.txt` y `old-docs/Auditoría y Rediseño Estructural del Ecosistema de Archivos UMSS.txt`.
- **Metodología**: 15 sesiones de observación contextual con protocolo Think-Aloud en entornos naturales (biblioteca, sala de docentes, oficinas de Kardex). Muestra: 5 estudiantes, 5 docentes, 5 administrativos.
- **Hallazgos cuantitativos validados**:
  - **100%** de los estudiantes falló al intentar subir archivos > 50MB por Moodle.
  - **100%** de los docentes careció de buzón centralizado; recibió trabajos por WhatsApp o correo personal.
  - **60%** de los casos de compartir archivos terminó con enlace en modo "Restringido" (bloqueando al receptor).
  - **3 de 5** administrativos usaron pendrive físico para enviar documentos confidenciales.
  - Severidad P1 (catastrófica): enlaces caducados/restringidos bloquean la tarea principal.
- **Personas validadas en campo**: Sebastián (Estudiante, Ingeniería), Lic. Alejandro (Docente, Humanidades), Silvia (Administrativa, Kardex).
- **Hipótesis principal validada**: Proveer un buzón institucional unificado reduciría ≥ 80% el uso de canales informales (WhatsApp, WeTransfer).
- **Artefactos M2**: Wireframes Balsamiq (4 pantallas), 20 Happy Paths en Figma (`https://www.figma.com/board/8b3BCvbLJ0gyO0pyJYXFZd/SimonCloud`), 20 capturas de incidentes en `old-docs/Journeys/`.
- **Próxima cadencia**: Quincenal durante el desarrollo del MVP, enfocada en flujos de subida y homologación.

---

## 4. Usuarios objetivo / Personas clave

### 4.1 Persona principal — Docente Universitario

| Atributo | Valor |
|----------|-------|
| Nombre / rol | Docente universitario UMSS |
| Contexto | Dicta entre 2 y 4 materias por semestre; usa Moodle y/o Google Classroom como LMS. Al cierre del semestre trabaja con Excel para cruzar notas y entregar actas a la Dirección Académica. |
| *Jobs-to-be-done* | 1. Centralizar recursos y materiales de sus materias. 2. Importar y homologar calificaciones de múltiples LMS. 3. Comunicar anuncios oficiales a sus estudiantes. 4. Generar y firmar el acta final sin errores. |
| Dolores principales | Horas perdidas en cruce manual de datos; errores de duplicación de alumnos; falta de trazabilidad de la nota original; riesgo de actas incorrectas. |
| Ganancia esperada | Generar la planilla consolidada en menos de 5 minutos, con conversión automática de escalas, cero duplicados y trazabilidad completa del origen de cada nota. |

### 4.2 Persona secundaria — Personal Administrativo (Dirección Académica)

| Atributo | Valor |
|----------|-------|
| Nombre / rol | Funcionario de la Dirección Académica / Secretaría de Facultad |
| Contexto | Recibe actas finales de los docentes al cierre de semestre; valida y consolida registros oficiales; gestiona solicitudes de corrección de calificaciones. |
| *Jobs-to-be-done* | 1. Asignar materias y horarios. 2. Validar y consolidar actas finales enviadas por docentes. 3. Resolver solicitudes excepcionales de corrección de notas. 4. Auditar el historial de cambios en documentos oficiales. |
| Dolores principales | Actas con errores de transcripción; procesos de corrección lentos y sin trazabilidad; falta de un sistema unificado de seguimiento. |
| Ganancia esperada | Recibir actas digitales con sello de integridad (hash), trazabilidad completa y un flujo formal de aprobación/rechazo de correcciones. |

---

## 5. Propuesta de valor

| Eje | Contenido |
|-----|-----------|
| **Para quién** | Docentes universitarios de la UMSS (y universidades bolivianas en expansión) que gestionan calificaciones en múltiples LMS |
| **Que necesita** | Consolidar y homologar calificaciones de distintas plataformas en una sola acta oficial, sin trabajo manual ni riesgo de errores |
| **Nuestra propuesta es** | SimonCloud: plataforma institucional de gestión académica y almacenamiento en la nube que sincroniza, homologa y centraliza la información de múltiples LMS en un dashboard unificado |
| **Que le aporta** | • Importación automática de notas desde Moodle y Google Classroom. • Conversión automática de escalas a la escala oficial (0–100). • Deduplicación de alumnos por correo/ID institucional. • Comprobante de entrega con hash SHA-256. • Control de acceso por roles (RBAC). |
| **A diferencia de** | Hojas de cálculo Excel + exportaciones manuales de Moodle y Classroom; sistemas legacy de la UMSS sin integración LMS |
| **Nuestro diferencial es** | Es la única plataforma diseñada específicamente para el contexto normativo y académico boliviano, con modelo freemium institucional, multi-tenant y soberanía de datos por universidad |

---

## 6. Panorama competitivo (resumen)

| Competidor / alternativa | Tipo | Fortaleza percibida | Debilidad percibida |
|--------------------------|------|---------------------|---------------------|
| Excel + Drive + exportaciones manuales | *do-nothing* | Familiar para los docentes; sin costo directo | Propenso a errores; sin trazabilidad; alto costo en tiempo |
| Moodle (standalone) | Indirecto | LMS maduro y open-source | No resuelve multi-LMS; no homologa escalas; no genera actas institucionales |
| Google Workspace for Education | Indirecto | UX moderna; adopción masiva | No homologa escalas de calificación bolivianas; sin soberanía de datos institucional; no integra Moodle |
| Sistemas legacy UMSS (SIA, otros) | Indirecto | Ya integrado al proceso administrativo | Sin interfaz de usuario moderna; sin integración LMS; sin homologación automática |

> *Nota: el análisis profundo de competencia se desarrollará en el MRD (`docs/MRD.md`).*

---

## 7. Business Model Canvas

| Bloque | Mínimo 3 elementos concretos |
|--------|-------------------------------|
| **1. Segmentos de clientes** | Universidades bolivianas (instituciones, B2B) / Docentes universitarios (usuarios activos clave) / Estudiantes universitarios / Personal administrativo / Usuarios externos (licencias individuales) |
| **2. Propuesta de valor** | Homologación automática multi-LMS con trazabilidad / Comprobante de entrega inmutable (SHA-256) / Dashboard académico unificado por rol / Eliminación de trabajo manual en Excel |
| **3. Canales** | Docentes como canal de adopción orgánica (lo aplican en sus clases) / Convenio institucional con UMSS / Correo institucional universitario / Portal web de SimonCloud |
| **4. Relación con clientes** | Administrador propio por universidad (tenant admin) / Documentación y tutoriales en plataforma / Comunidad/foro por institución / Soporte técnico delegado al admin local |
| **5. Fuentes de ingresos** | Freemium institucional para universidades (acceso base gratuito) / Licencias Pro para usuarios externos individuales (precio por definir) / Plan Pro 50 GB para usuarios con necesidades ampliadas (precio por definir) |
| **6. Recursos clave** | Infraestructura cloud / servidores / Base de usuarios UMSS (piloto) / APIs de integración (Moodle API, Google Classroom API) / Equipo de desarrollo / Convenios institucionales |
| **7. Actividades clave** | Desarrollo y mantenimiento de la plataforma / Integración y sincronización con LMS externos / Homologación automática de calificaciones / Gestión de identidad y RBAC / Generación de actas y comprobantes hash |
| **8. Socios clave** | UMSS (socio fundador y único piloto actual) / Moodle (integración LMS) / Google Classroom API / QR Simple (pasarela de pagos) / Google Drive API (migración de archivos) |
| **9. Estructura de costos** | Hosting y servidores cloud (costo dominante) / Soporte técnico y operativo / Equipo de desarrollo (salarios o honorarios) |

---

## 8. Métricas clave de éxito (North Star + apoyo)

| ID | KPI | North Star? | Línea base | Meta | Horizonte | Fuente del dato |
|----|-----|-------------|------------|------|-----------|-----------------|
| KPI-01 | Tiempo medio de generación de planilla consolidada por docente | ✅ Sí | ~4 horas (manual) | ≤ 5 minutos | Q4 2026 | Logs del sistema + encuesta docentes |
| KPI-02 | Tasa de duplicación de alumnos en planillas generadas | No | Por medir antes del lanzamiento | 0 % | Q4 2026 | Auditoría del sistema |
| KPI-03 | Tasa de error en actas finales emitidas | No | Por medir antes del lanzamiento | 0 % | Q4 2026 | Dirección Académica |
| KPI-04 | Número de materias activas en el piloto UMSS | No | 0 | ≥ 5 materias | Q3 2026 | Panel de administración |

---

## 9. Objetivos de negocio (SMART)

| ID | Objetivo | Métrica | Línea base | Meta | Horizonte |
|----|----------|---------|------------|------|-----------|
| BO-01 | Reducir el tiempo de homologación de calificaciones de los docentes UMSS | Minutos por planilla | ~240 min | ≤ 5 min | Q4 2026 |
| BO-02 | Eliminar la duplicación de alumnos en planillas consolidadas | % de duplicados | Por medir | 0 % | Q4 2026 |
| BO-03 | Lograr adopción piloto en UMSS | Número de materias activas | 0 | ≥ 5 | Q3 2026 |
| BO-04 | Expandir SimonCloud a 2 universidades bolivianas adicionales | Número de tenants activos | 1 (UMSS) | 3 | Q4 2027 |

---

## 10. Stakeholders y roles (modelo RACI)

| Stakeholder | Interés | R / A / C / I |
|-------------|---------|----------------|
| DTIC – UMSS (Sponsor) | Estratégico / institucional | A |
| Equipo de desarrollo (C. Gomez) | Técnico / producto | R |
| Docentes UMSS | Experiencia de usuario / eficiencia | C |
| Administradores universitarios | Operativo / gestión de usuarios | C |
| Dirección Académica | Validación de actas / normativa | C |
| Estudiantes UMSS | Experiencia de usuario | I |

---

## 11. Requerimientos de negocio

| ID | Requerimiento de negocio | Prioridad (MoSCoW) | Justificación | Métrica de aceptación |
|----|--------------------------|--------------------|---------------|-----------------------|
| BR-001 | El sistema debe permitir a los docentes importar calificaciones desde Moodle y Google Classroom en una sola operación | Must | Elimina el cruce manual entre plataformas | 100 % de importaciones completan sin intervención manual |
| BR-002 | El sistema debe homologar automáticamente calificaciones de distintas escalas al formato oficial (0–100) según tabla de equivalencias aprobada | Must | Garantiza estandarización normativa | 0 % de conversiones manuales requeridas post-importación |
| BR-003 | El sistema debe identificar y deduplicar estudiantes por correo o ID institucional | Must | Evita errores de duplicación en actas | 0 % de alumnos duplicados en planillas generadas |
| BR-004 | El sistema debe mantener trazabilidad de la fuente original de cada calificación importada | Must | Requisito de auditoría y transparencia | 100 % de notas con campo "fuente" visible en la planilla |
| BR-005 | Las actas finales cerradas no pueden ser modificadas sin autorización formal del perfil Administrativo | Must | Restricción normativa / integridad académica | 0 % de modificaciones post-cierre sin registro de autorización |
| BR-006 | El sistema debe gestionar identidad y control de acceso por roles (Docente, Estudiante, Administrativo, Admin) | Must | Seguridad y separación de responsabilidades | Cada rol accede únicamente a las funciones definidas en la matriz RBAC |
| BR-007 | El sistema debe generar comprobantes de entrega con hash SHA-256 para archivos enviados en buzones | Should | Garantía legal de integridad de entrega | Hash generado y visible para el estudiante en el 100 % de las entregas |
| BR-008 | El sistema debe permitir comunicación formal mediante anuncios de materia (docente → estudiantes) | Should | Centraliza la comunicación académica | Anuncios entregados al 100 % de los alumnos matriculados en la materia |
| BR-009 | El sistema debe soportar arquitectura multi-tenant con administración independiente por institución | Should | Permite expansión nacional sin dependencia central | Cada universidad gestiona sus propios usuarios y base de datos de forma aislada |
| BR-010 | El sistema debe integrarse con la pasarela QR Simple para la adquisición de licencias Pro | Could | Habilita el modelo de ingresos por upgrades individuales | Flujo de pago completado en < 3 pasos desde la interfaz |

---

## 12. Reglas de negocio y políticas

| ID | Regla | Tipo | Origen |
|----|-------|------|--------|
| RB-01 | Solo los docentes asignados oficialmente a una materia pueden sincronizar calificaciones desde sus LMS | Política | Reglamento académico UMSS |
| RB-02 | Las notas finales, una vez cerradas en el período académico, no pueden ser alteradas por el docente sin un proceso de autorización del perfil Administrativo | Normativa | Reglamento de evaluación UMSS |
| RB-03 | Los estudiantes tienen únicamente acceso de lectura a sus propias notas consolidadas | Política | Privacidad de datos académicos |
| RB-04 | Ningún estudiante puede quedar duplicado en la lista final; el cruce de identidad debe realizarse exactamente mediante correo institucional o ID universitario | Política | Integridad de datos / consistencia de actas |
| RB-05 | Toda nota importada debe conservar obligatoriamente la trazabilidad de su fuente original (Moodle / Classroom) | Normativa | Auditoría académica |
| RB-06 | Si la escala de calificación de origen no es numérica, debe existir una tabla de equivalencias oficial aprobada por la administración antes de ejecutar la conversión | Política | Reglamento de evaluación UMSS |

---

## 13. Supuestos, restricciones y dependencias

### Supuestos
- Las universidades bolivianas disponen de conectividad a internet suficiente para operar la plataforma.
- Los docentes cuentan con cuentas activas en al menos un LMS (Moodle o Google Classroom).
- La UMSS actúa como socio fundador y otorga acceso a su base de usuarios institucional.
- El convenio institucional con la UMSS estará formalizado antes del lanzamiento del piloto.
- Las APIs públicas de Moodle y Google Classroom estarán disponibles y estables durante el desarrollo del MVP.
- Los docentes del piloto están dispuestos a adoptar una nueva herramienta si reduce su carga operativa.

### Restricciones
- El precio del plan Pro para usuarios externos está por definir; no puede lanzarse el módulo de pagos sin estructura de precios aprobada.
- El sistema debe cumplir con las normativas bolivianas de protección de datos personales (Ley N.º 164 y normativa AGETIC).
- Las actas finales cerradas son inmutables sin autorización administrativa (restricción normativa de la UMSS).
- El MVP está limitado a la UMSS como único piloto; la expansión a otras universidades es posterior.
- No se prevén integraciones con otros LMS más allá de Moodle y Google Classroom en la fase MVP.

### Dependencias
- API de Moodle (integración bidireccional de calificaciones y materias).
- API de Google Classroom (importación de calificaciones).
- API de QR Simple (pasarela de pagos para upgrades).
- API de Google Drive (migración de archivos personales).
- Convenio institucional firmado con UMSS.
- Tabla de equivalencias de escalas de calificación aprobada por la Dirección Académica de la UMSS.

---

## 14. Alcance de negocio

### 14.1 En alcance
- Gestión de identidad y control de acceso por roles (RBAC): Docente, Estudiante, Administrativo, Admin.
- Integración y sincronización con Moodle y Google Classroom.
- Homologación automática de calificaciones de distintas escalas al formato oficial (0–100).
- Dashboard unificado para docentes con sus materias y estado de calificaciones.
- Sistema de seguimiento y consolidación de calificaciones por semestre.
- Herramienta de anuncios para comunicación docente–estudiante.
- Generación de planillas consolidadas y actas finales con validación administrativa.
- Comprobante de entrega con hash SHA-256 para buzones de tareas.
- Modelo multi-tenant con administración independiente por institución.
- Pasarela de pago QR Simple para plan Pro individual.

### 14.2 Fuera de alcance
- App móvil nativa (iOS / Android) en la fase MVP.
- Integración con LMS distintos de Moodle y Google Classroom.
- Funcionalidades de evaluación directa dentro de SimonCloud (quizzes, exámenes en línea).
- Gestión de horarios, calendario académico o asignación de aulas.
- Integración con sistemas bancarios más allá de QR Simple.
- Módulo de videoconferencia o mensajería en tiempo real.

---

## 15. Beneficios esperados y *business case* resumido

> *Nota: los valores monetarios son estimados orientativos basados en supuestos de productividad. Se refinarán con datos reales del piloto UMSS.*

| Tipo | Año 1 (Piloto UMSS) | Año 2 (Expansión Bolivia) | Año 3 (Consolidación) |
|------|---------------------|--------------------------|----------------------|
| Ahorro operativo (horas docente) | ~1 500 h/semestre × 2 = 3 000 h/año a $5 USD/h estimado = **$15 000 USD** | ~10 000 h/año = **$50 000 USD** | ~25 000 h/año = **$125 000 USD** |
| Ingresos por licencias Pro (externos) | Por definir (precio pendiente) | Estimado bajo ($2 000–5 000 USD) | Creciente con base de usuarios |
| Inversión CAPEX (desarrollo MVP) | $8 000–15 000 USD | $5 000 USD (nuevas integraciones) | $5 000 USD |
| OPEX anual (hosting + soporte) | $3 000–6 000 USD | $8 000 USD | $12 000 USD |
| **Balance estimado Año 1** | **Positivo si se contabilizan externalidades de productividad** | — | — |

---

## 16. Riesgos de negocio

| Riesgo | Probabilidad | Impacto | Mitigación | Responsable |
|--------|--------------|---------|------------|-------------|
| Baja adopción por resistencia al cambio de los docentes | Media | Alto | Capacitaciones presenciales; champions docentes; demostración de ahorro de tiempo en piloto | Equipo de producto |
| Cambios en APIs de terceros (Moodle, Google) que rompan integraciones | Media | Alto | Abstracción de capa de integración; versionado de conectores; monitoreo de changelogs | Equipo técnico |
| Precios del plan Pro no aprobados, bloqueando el modelo de ingresos | Alta | Medio | Definir estructura de precios antes del lanzamiento del módulo de pagos; validar con DTIC | PM + Sponsor |
| Falta de normativa para el uso de actas digitales en Bolivia | Baja | Alto | Consultoría legal preventiva; obtener aval formal de la Dirección Académica | Sponsor (DTIC) |
| Escalabilidad de infraestructura al crecer más allá de UMSS | Baja (Año 1) | Alto | Arquitectura cloud elástica desde el MVP; pruebas de carga antes de expansión | Equipo técnico |
| Datos sensibles de estudiantes expuestos por fallo de seguridad | Baja | Muy alto | Cifrado en tránsito y reposo; RBAC estricto; auditorías periódicas; cumplimiento Ley 164 | Equipo técnico + Admin |

---

## 17. Criterios de éxito del proyecto de negocio

- Cumplimiento de ≥ 80 % de los objetivos SMART definidos en la sección 9 al cierre del piloto (Q4 2026).
- Al menos 5 materias activas en UMSS con planillas generadas por SimonCloud sin intervención manual.
- Cero actas finales con errores de duplicación o conversión de escala durante el semestre piloto.
- Satisfacción del sponsor (DTIC) ≥ 4/5 en evaluación formal post-piloto.
- Validación positiva del flujo de homologación por parte de la Dirección Académica (aprobación del acta digital).

---

## 18. Trazabilidad a documentos hijos

| BRD ID | MRD relacionado | PRD relacionado | Caso de uso FSD |
|--------|-----------------|-----------------|-----------------|
| BR-001 | MRD-N-01 | PRD-REQ-01 | FSD-UC-001 (Importar calificaciones LMS) |
| BR-002 | MRD-N-01 | PRD-REQ-02 | FSD-UC-002 (Homologar escala de calificaciones) |
| BR-003 | MRD-N-01 | PRD-REQ-03 | FSD-UC-003 (Deduplicar alumnos por ID) |
| BR-004 | MRD-N-02 | PRD-REQ-04 | FSD-UC-004 (Trazabilidad de fuente de nota) |
| BR-005 | MRD-N-03 | PRD-REQ-05 | FSD-UC-005 (Cierre y bloqueo de acta final) |
| BR-006 | MRD-N-04 | PRD-REQ-06 | FSD-UC-006 (Control de acceso RBAC) |
| BR-007 | MRD-N-05 | PRD-REQ-07 | FSD-UC-007 (Comprobante SHA-256) |

---

## 19. Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Sponsor (DTIC) | — | | |
| PM / Autor | Carlos Alberto Gomez Ormachea | | 08/05/2026 |
| Revisor (Docente) | — | | |

---

## 20. Registro de cambios

| Versión | Fecha | Autor | Cambio |
|---------|-------|-------|--------|
| v0.1 | 08/05/2026 | Carlos Alberto Gomez Ormachea | Versión inicial del BRD |
| v2.0 | 11/05/2026 | Carlos Alberto Gomez Ormachea | Agregada evidencia Discovery M2 (§3.3), metadatos de prompts y PR-FAQ. |

---

## 21. Anexo — PR‑FAQ Amazon‑style (Working Backwards)

### 21.1 Press Release

```text
Cochabamba, Bolivia — 15 de agosto de 2026

La Universidad Mayor de San Simón anuncia SimonCloud, la primera plataforma
nativa de gestión académica universitaria de Bolivia. Permite a los docentes
consolidar calificaciones de Moodle y Classroom en un acta unificada en
menos de 5 minutos, y a los estudiantes entregar trabajos de más de 2GB
con un comprobante legal inmutable (Hash SHA-256).

"SimonCloud le devuelve el tiempo al docente. Antes, el cierre de actas
tomaba un fin de semana de trabajo manual en Excel. Ahora es un clic.",
dijo el Director de la DTIC de la UMSS.

Actualmente el 100% de los estudiantes de carreras técnicas falla al
entregar archivos por Moodle (límite de 50MB), y los docentes reciben
trabajos desordenados por WhatsApp. SimonCloud resuelve esto con buzones
de entrega seguros (SimonDrop) y homologación automática de escalas.

SimonCloud estará disponible para la comunidad UMSS en el segundo semestre
de 2026. Más información: simoncloud.umss.edu.bo
```

### 21.2 External FAQ

- **¿Qué es SimonCloud?** La nube académica oficial de la UMSS: un lugar único para entregar trabajos, recibir comprobantes de entrega y ver notas consolidadas.
- **¿En qué se diferencia de Google Drive?** Está integrado con el WebSISS (SSO), los buzones tienen cierre automático, y los archivos pertenecen a la UMSS, no a Google.
- **¿Cómo sé que mi tarea fue recibida?** Recibes un recibo digital con Hash SHA-256, prueba criptográfica de que el contenido no fue alterado post-entrega.
- **¿Cuánto cuesta?** 15GB gratuitos con credencial institucional. 50GB por Bs. 50/semestre vía QR Simple.

### 21.3 Internal FAQ

- **¿Por qué ahora?** Severidad máxima (nivel 4 en escala Nielsen) detectada en campo; cada semestre sin solución genera pérdida de trabajos y conflictos académicos.
- **¿Cuál es el retorno?** $15,000 USD de ahorro en H/H docentes en Año 1; modelo Freemium proyecta autofinanciamiento en Año 2.
- **¿Cómo escalamos?** Arquitectura multi-tenant (SCaaS) permite incorporar otras universidades bolivianas sin rediseño del núcleo.

---

## ✅ Checklist mínimo de entrega

- [x] **Resumen ejecutivo** de ½ página con problema, propuesta, valor y métricas.
- [x] Problema de negocio con evidencia cuantitativa.
- [x] **2 personas / usuarios objetivo** caracterizadas (JTBD, dolores, ganancias).
- [x] **Propuesta de valor** explícita (formato VPC).
- [x] **Panorama competitivo resumen** con ≥ 3 alternativas (incluyendo *do-nothing*).
- [x] **Business Model Canvas** con los 9 bloques poblados, ≥ 3 elementos por bloque.
- [x] **Métricas clave de éxito**: 1 *North Star* + 3 KPIs de apoyo, con meta y horizonte.
- [x] 4 objetivos de negocio SMART.
- [x] Matriz RACI completa.
- [x] 10 requerimientos de negocio priorizados (MoSCoW).
- [x] Reglas, restricciones, supuestos y dependencias explícitos.
- [x] *Business case* cuantitativo estimado (Años 1–3).
- [x] Trazabilidad a MRD/PRD iniciada.
