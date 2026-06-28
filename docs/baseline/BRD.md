<!--
status: congelado
capa: baseline (M4)
tag: release/2.0.0
origen: docs/brd/BRD_vFinal.md
congelado: 2026-06-28
NO EDITAR. Registro histórico evaluado de M4. Los cambios de implementación
van a docs/product/ + docs/product/DTP.md (ver docs/baseline/README.md).
-->

# Business Requirements Document (BRD) – SimonCloud

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
| Prompts utilizados | `PR-BRD-001` (ver `docs/PROMPT_MAPPING.md`) |

---

## 1. Resumen ejecutivo

Los docentes de la Universidad Mayor de San Simón (UMSS) gestionan hoy sus calificaciones en múltiples plataformas de aprendizaje (Moodle, Google Classroom) con escalas heterogéneas, y deben consolidar manualmente esos datos en hojas de cálculo para producir las actas finales oficiales. Este proceso consume varias horas por docente por semestre, genera errores de duplicación de alumnos y carece de trazabilidad legal.

**SimonCloud** es una plataforma web multi-tenant de almacenamiento institucional y entregas académicas que permite a los docentes crear buzones de entrega (SimonDrop) integrados nativamente en Moodle y Google Classroom vía LTI 1.3, con comprobantes de integridad inmutables (SHA-256) y control de acceso por roles.

**Valor esperado:**
- Eliminación del uso de WhatsApp/WeTransfer/correo para recepción de trabajos académicos.
- 100 % de entregas con comprobante SHA-256 verificable (validez legal bajo Ley 164).
- Integración nativa en los LMS institucionales: el estudiante entrega sin salir de Moodle o Classroom.

**Métricas clave de éxito:**
- SimonDrops activos vinculados a tareas LMS: ≥ 1 por materia piloto.
- Tasa de entregas con comprobante SHA-256: 100 %.
- Adopción en UMSS: ≥ 5 materias piloto en el primer semestre.

**Llamada a la acción:** Se requiere que la DTIC formalice el convenio institucional de uso de SimonCloud, registre SimonCloud como External Tool en Moodle (coordinación LTI), y provea acceso a la base de usuarios UMSS vía WebSISS SSO.

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

Los docentes universitarios de la UMSS reciben hoy las entregas académicas de sus estudiantes a través de canales informales: correo personal, WhatsApp y WeTransfer. Moodle —el LMS institucional— impone un límite de 50 MB que bloquea el 100 % de los archivos técnicos pesados (proyectos CAD, datasets, vídeos de presentación). Google Classroom no ofrece soberanía de datos institucional y los archivos quedan en cuentas personales de Google.

Este proceso presenta cuatro síntomas críticos: (1) **fragmentación de canales** —cada docente usa una combinación diferente de WhatsApp, Drive personal y correo; sin registro centralizado—; (2) **falta de integridad** —no existe forma de probar que el archivo recibido es el mismo que el estudiante envió; los enlaces de WeTransfer expiran—; (3) **ausencia de trazabilidad legal** —la Ley 164 exige cadena de custodia de datos académicos, que correos y mensajes de WhatsApp no garantizan—; (4) **doble gestión** —si el docente usa Moodle como LMS, debe marcar la entrega allí manualmente después de recibirla por WhatsApp, duplicando el trabajo—.

La consecuencia de no actuar es la perpetuación de un sistema propenso a pérdida de archivos, disputas académicas sin evidencia verificable y exposición a sanciones por incumplimiento de la Ley 164.

### 3.2 Oportunidad

- **Valor operativo**: Centralizando la recepción de entregas en un buzón institucional (SimonDrop), cada docente elimina la gestión manual de correos y WhatsApp —se estima un ahorro de ≥ 2 horas/semestre por materia activa en seguimiento y validación de entregas—.
- **Valor estratégico**: Posiciona a la UMSS como pionera en soberanía digital académica en Bolivia, con infraestructura propia on-premise (DTIC-UMSS) frente a soluciones de terceros (Google, Microsoft) que no se alinean al reglamento de datos de instituciones públicas bolivianas.
- **Ventana de oportunidad**: La creciente adopción de Moodle post-pandemia y el estándar LTI 1.3 (el mismo que usa Turnitin y Khan Academy) crean una ventana de adopción temprana. Integrarse como opción nativa de entrega en Moodle antes de que actores internacionales consoliden su presencia es el horizonte estratégico de los próximos 2 años.

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
- **Próxima cadencia**: Quincenal durante el desarrollo del MVP, enfocada en flujos de subida, entrega desde LMS y emisión de comprobantes SHA-256.

---

## 4. Usuarios objetivo / Personas clave

### 4.1 Persona principal — Docente Universitario

| Atributo | Valor |
|----------|-------|
| Nombre / rol | Docente universitario UMSS |
| Contexto | Dicta entre 2 y 4 materias por semestre; usa Moodle y/o Google Classroom como LMS. Al cierre del semestre trabaja con Excel para cruzar notas y entregar actas a la Dirección Académica. |
| *Jobs-to-be-done* | 1. Centralizar recursos y materiales de sus materias. 2. Recibir entregas de tareas de forma organizada, sin correo ni WhatsApp. 3. Tener comprobante de que cada estudiante entregó a tiempo. 4. Comunicar anuncios oficiales a sus estudiantes. |
| Dolores principales | Recibe 80 archivos por correo/WhatsApp por tarea; sin trazabilidad de quién entregó qué; links de WeTransfer expirados; no puede verificar integridad del archivo recibido. |
| Ganancia esperada | Un buzón SimonDrop vinculado a la tarea en Moodle/Classroom: los estudiantes entregan desde el LMS, el docente ve todas las entregas con hash SHA-256 y fecha exacta. |

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
| **Para quién** | Docentes universitarios de la UMSS (y universidades bolivianas en expansión) que reciben trabajos académicos por canales informales (WhatsApp, correo, WeTransfer) |
| **Que necesita** | Un buzón de entrega institucional integrado en su LMS con garantía de integridad de los archivos recibidos |
| **Nuestra propuesta es** | SimonCloud: plataforma institucional de almacenamiento y entregas académicas que ofrece SimonDrops integrados en Moodle/Classroom vía LTI 1.3, con comprobantes SHA-256 y soberanía de datos |
| **Que le aporta** | • SimonDrop como opción nativa de entrega en Moodle y Classroom (LTI 1.3). • Comprobante de entrega inmutable con hash SHA-256. • Notificación automática al LMS cuando el estudiante entrega. • Control de acceso por roles (RBAC). • Almacenamiento hasta 2GB por archivo, sin límites de Moodle. |
| **A diferencia de** | Hojas de cálculo Excel + exportaciones manuales de Moodle y Classroom; sistemas legacy de la UMSS sin integración LMS |
| **Nuestro diferencial es** | Es la única plataforma diseñada específicamente para el contexto normativo y académico boliviano, con modelo freemium institucional, multi-tenant y soberanía de datos por universidad |

---

## 6. Panorama competitivo (resumen)

| Competidor / alternativa | Tipo | Fortaleza percibida | Debilidad percibida |
|--------------------------|------|---------------------|---------------------|
| WhatsApp + correo personal + WeTransfer | *do-nothing* | Sin fricción; omnipresente | Sin trazabilidad legal; enlaces expiran; no cumple Ley 164; sin comprobante de integridad |
| Moodle (standalone) | Indirecto | LMS maduro y open-source | Límite 50MB bloquea archivos técnicos; no genera comprobante SHA-256; sin soberanía de datos on-premise |
| Google Workspace for Education | Indirecto | UX moderna; adopción masiva | Sin soberanía de datos institucional (datos en servidores Google); no cumple normativa pública boliviana |
| Sistemas legacy UMSS (SIA, otros) | Indirecto | Ya integrado al proceso administrativo | Sin interfaz de usuario moderna; sin integración LMS; sin gestión de entregas ni buzones |

> *Nota: el análisis profundo de competencia se desarrollará en el MRD (`docs/MRD.md`).*

---

## 7. Business Model Canvas

| Bloque | Mínimo 3 elementos concretos |
|--------|-------------------------------|
| **1. Segmentos de clientes** | Universidades bolivianas (instituciones, B2B) / Docentes universitarios (usuarios activos clave) / Estudiantes universitarios / Personal administrativo / Usuarios externos (licencias individuales) |
| **2. Propuesta de valor** | SimonDrop integrado en LMS vía LTI 1.3 / Comprobante de entrega inmutable (SHA-256) / Dashboard académico unificado por rol / Soberanía de datos on-premise (Ley 164) |
| **3. Canales** | Docentes como canal de adopción orgánica (lo aplican en sus clases) / Convenio institucional con UMSS / Correo institucional universitario / Portal web de SimonCloud |
| **4. Relación con clientes** | Administrador propio por universidad (tenant admin) / Documentación y tutoriales en plataforma / Comunidad/foro por institución / Soporte técnico delegado al admin local |
| **5. Fuentes de ingresos** | Freemium institucional para universidades (acceso base gratuito) / Licencias Pro para usuarios externos individuales (precio por definir) / Plan Pro 50 GB para usuarios con necesidades ampliadas (precio por definir) |
| **6. Recursos clave** | Infraestructura cloud / servidores / Base de usuarios UMSS (piloto) / APIs de integración (Moodle API, Google Classroom API) / Equipo de desarrollo / Convenios institucionales |
| **7. Actividades clave** | Desarrollo y mantenimiento de la plataforma / Integración LMS vía LTI 1.3 y OAuth2 / Gestión de identidad y RBAC / Generación de comprobantes hash SHA-256 / Operación on-premise DTIC |
| **8. Socios clave** | UMSS (socio fundador y único piloto actual) / Moodle (integración LMS) / Google Classroom API / QR Simple (pasarela de pagos) / Google Drive API (migración de archivos) |
| **9. Estructura de costos** | Hosting y servidores cloud (costo dominante) / Soporte técnico y operativo / Equipo de desarrollo (salarios o honorarios) |

---

## 8. Métricas clave de éxito (North Star + apoyo)

| ID | KPI | North Star? | Línea base | Meta | Horizonte | Fuente del dato |
|----|-----|-------------|------------|------|-----------|-----------------|
| KPI-01 | Número de entregas académicas recibidas vía SimonDrop (no por WhatsApp/email) | ✅ Sí | 0 | ≥ 500 entregas/semestre piloto | Q4 2026 | Logs del sistema |
| KPI-02 | Tasa de entregas con comprobante SHA-256 generado | No | 0 % | 100 % | Q4 2026 | Auditoría BD |
| KPI-03 | SimonDrops activos vinculados a tareas LMS | No | 0 | ≥ 1 por materia activa | Q4 2026 | Panel de administración |
| KPI-04 | Número de materias activas en el piloto UMSS | No | 0 | ≥ 5 materias | Q3 2026 | Panel de administración |

---

## 9. Objetivos de negocio (SMART)

| ID | Objetivo | Métrica | Línea base | Meta | Horizonte |
|----|----------|---------|------------|------|-----------|
| BO-01 | Eliminar el uso de canales informales (WhatsApp, WeTransfer) para recepción de tareas académicas | % entregas por canal informal | ~80% | ≤ 20% | Q4 2026 |
| BO-02 | Garantizar integridad legal de todas las entregas académicas en la UMSS | % entregas con SHA-256 | 0 % | 100 % | Q4 2026 |
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
| BR-001 | El sistema debe permitir a los docentes sincronizar sus cursos y tareas desde Moodle y Google Classroom para crear SimonDrops vinculados | Must | Habilita la integración LMS sin copiar datos manualmente | 100 % de SimonDrops vinculados tienen lms_course_id y lms_assignment_id |
| BR-002 | El sistema debe aparecer como opción de entrega nativa en Moodle (LTI 1.3) al nivel de "Archivo" o "Enlace" | Must | Es el diferenciador central frente a WeTransfer/Drive | SimonDrop visible en tareas Moodle sin configuración adicional del estudiante |
| BR-003 | El sistema debe notificar automáticamente al LMS cuando un estudiante completa su entrega (LTI AGS) | Must | Evita que el docente tenga que marcar manualmente la entrega en dos sistemas | 100 % de entregas generan notificación LTI AGS al LMS |
| BR-004 | El sistema debe mantener trazabilidad de la entrega: lms_assignment_id, lms_course_id, student_id LTI, hash SHA-256 y timestamp | Must | Requisito de auditoría y trazabilidad legal (Ley 164) | 100 % de entregas con los 5 campos registrados |
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
| RB-01 | Solo el docente propietario del buzón (SimonDrop) puede ver las entregas recibidas; otros docentes no tienen visibilidad cruzada | Política | Privacidad académica / RBAC |
| RB-02 | Un buzón SimonDrop cerrado no puede recibir nuevas entregas; los archivos ya entregados son de solo lectura (soft-delete obligatorio) | Normativa | Integridad de evidencia / Ley 164 |
| RB-03 | Cada entrega debe generar y asociar un comprobante con hash SHA-256 en el mismo instante del commit a la base de datos (operación atómica) | Normativa | Ley 164 Bolivia — cadena de custodia de datos académicos |
| RB-04 | La identidad del estudiante en SimonCloud debe coincidir exactamente con su `lms_user_id` LTI; no se permiten entregas sin autenticación previa vía SSO WebSISS | Política | Integridad de datos / Reglamento académico UMSS |
| RB-05 | Toda entrega vía LTI debe registrar obligatoriamente los campos: `lms_assignment_id`, `lms_course_id`, `lms_user_id`, `sha256_hash` y `submitted_at` | Normativa | Auditoría académica / trazabilidad Ley 164 |
| RB-06 | Una notificación LTI AGS (Activity Grade Services) al LMS de origen debe enviarse dentro de los 30 segundos posteriores a la confirmación de entrega | Política | Consistencia entre SimonCloud y Moodle/Classroom |

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
- Moodle LTI 1.3 (registro de SimonCloud como External Tool en la instancia institucional de Moodle UMSS).
- Google Classroom API + OAuth2 (integración de buzones en la fase 2 del ADR-0006).
- SSO WebSISS OAuth2 (autenticación institucional UMSS — todos los usuarios).
- API de QR Simple Bolivia (pasarela de pagos para upgrades a plan Pro).
- API de Google Drive (migración de archivos personales — módulo opcional).
- Convenio institucional firmado con UMSS (DTIC y Dirección Académica).

---

## 14. Alcance de negocio

### 14.1 En alcance
- Gestión de identidad y control de acceso por roles (RBAC): Docente, Estudiante, Administrativo, Admin.
- Integración LMS vía LTI 1.3: SimonDrop aparece como opción de entrega nativa en Moodle.
- Notificación automática al LMS vía LTI AGS cuando el estudiante completa su entrega.
- Dashboard unificado para docentes con sus materias y buzones SimonDrop activos.
- Almacenamiento de archivos hasta 2GB por entrega (on-premise MinIO, sin límites de Moodle).
- Comprobante de entrega con hash SHA-256 para cada archivo en buzón SimonDrop.
- Trazabilidad completa: `lms_assignment_id`, `lms_course_id`, `lms_user_id`, `sha256_hash`, `timestamp`.
- Herramienta de anuncios para comunicación docente–estudiante.
- Modelo multi-tenant con administración independiente por institución.
- Pasarela de pago QR Simple para plan Pro individual (50 GB).

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
| Ahorro operativo (horas docente — gestión de entregas) | ~5 materias piloto × 2 h/semestre × 2 semestres = **20 h/año piloto**; proyectado a 500 docentes: ~2 000 h/año a $5 USD/h = **$10 000 USD** | ~8 000 h/año = **$40 000 USD** | ~20 000 h/año = **$100 000 USD** |
| Ahorro en riesgo legal (cumplimiento Ley 164) | Evita sanciones AGETIC por manejo informal de datos de estudiantes (costo difícil de cuantificar, alto impacto) | — | — |
| Ingresos por licencias Pro (usuarios externos) | Por definir (precio pendiente) | Estimado bajo ($2 000–5 000 USD) | Creciente con base de usuarios |
| Inversión CAPEX (desarrollo MVP) | $8 000–15 000 USD | $5 000 USD (nuevas integraciones) | $5 000 USD |
| OPEX anual (hosting on-premise DTIC + soporte) | $1 000–3 000 USD | $5 000 USD | $8 000 USD |
| **Balance estimado Año 1** | **Positivo si se contabilizan externalidades de productividad y riesgo legal** | — | — |

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
- Al menos 5 materias activas en UMSS con SimonDrops vinculados a tareas Moodle vía LTI 1.3.
- 100 % de entregas registradas en el piloto cuentan con comprobante SHA-256 almacenado y verificable.
- Cero entregas perdidas o sin trazabilidad legal durante el semestre piloto.
- Satisfacción del sponsor (DTIC) ≥ 4/5 en evaluación formal post-piloto.
- SimonDrop registrado como External Tool en la instancia Moodle UMSS antes del inicio del piloto.

---

## 18. Trazabilidad a documentos hijos

| BRD ID | MRD relacionado | PRD relacionado | Caso de uso FSD |
|--------|-----------------|-----------------|-----------------|
| BR-001 | MRD-N-01 | PRD-REQ-001 | FSD-UC-001 (Autenticación SSO WebSISS) |
| BR-002 | MRD-N-01 | PRD-REQ-001 | FSD-UC-007 (SimonDrop — Entrega LTI 1.3) |
| BR-003 | MRD-N-01 | PRD-REQ-003 | FSD-UC-007 (Notificación LTI AGS al LMS) |
| BR-004 | MRD-N-02 | PRD-REQ-001 | FSD-UC-002 (Subida segura + SHA-256) |
| BR-005 | MRD-N-03 | PRD-REQ-005 | FSD-UC-005 (Cierre y bloqueo de buzón) |
| BR-006 | MRD-N-04 | PRD-REQ-006 | FSD-UC-006 (Control de acceso RBAC) |
| BR-007 | MRD-N-05 | PRD-REQ-007 | FSD-UC-002 (Comprobante SHA-256) |
| BR-008 | MRD-N-06 | PRD-REQ-008 | FSD-UC-008 (Anuncios — Notificación push/email) |
| BR-009 | MRD-N-07 | PRD-REQ-009 | FSD-UC-010 (Admin multi-tenant) |
| BR-010 | MRD-N-08 | PRD-REQ-010 | FSD-UC-003 (Upgrade cuota QR Simple) |

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
| v3.0 | 27/05/2026 | Carlos Alberto Gomez Ormachea | Reenfoque estratégico: propuesta de valor migrada de homologación de calificaciones a integración LMS vía SimonDrop (LTI 1.3) + SHA-256. Alineado con DTI vFinal, ADR-0006 y stack on-premise DTIC-UMSS. |

---

## 21. Anexo — PR‑FAQ Amazon‑style (Working Backwards)

### 21.1 Press Release

```text
Cochabamba, Bolivia — 15 de agosto de 2026

La Universidad Mayor de San Simón anuncia SimonCloud, la primera plataforma
institucional de entrega de trabajos académicos de Bolivia integrada
nativamente en Moodle. Los estudiantes entregan archivos de hasta 2GB
directamente desde la tarea Moodle, sin salir del LMS, y reciben en
segundos un comprobante legal inmutable (Hash SHA-256).

"SimonCloud elimina el caos de los 80 correos y WhatsApps que recibo por
cada tarea. Ahora todo llega al mismo lugar, con fecha y hash verificable.",
dijo una docente piloto de la Facultad de Ciencias y Tecnología UMSS.

Actualmente el 100% de los estudiantes de carreras técnicas falla al
entregar archivos por Moodle (límite de 50MB), y los docentes no tienen
forma legal de probar que los archivos recibidos por WhatsApp no fueron
alterados. SimonCloud resuelve esto con buzones de entrega seguros
(SimonDrop), integración LTI 1.3 con Moodle y certificados SHA-256.

SimonCloud estará disponible para la comunidad UMSS en el segundo semestre
de 2026. Más información: simoncloud.umss.edu.bo
```

### 21.2 External FAQ

- **¿Qué es SimonCloud?** La plataforma institucional de entrega de trabajos de la UMSS: buzones seguros (SimonDrop) integrados en Moodle, con comprobante SHA-256 de cada entrega y almacenamiento hasta 2GB por archivo.
- **¿En qué se diferencia de entregar por Moodle directamente?** Moodle tiene límite de 50MB. SimonCloud admite hasta 2GB, genera un comprobante de integridad (SHA-256) y guarda los archivos on-premise en la DTIC-UMSS, no en servidores externos.
- **¿Cómo sé que mi tarea fue recibida?** Recibes un recibo digital con Hash SHA-256, prueba criptográfica de que el contenido no fue alterado post-entrega. El docente también recibe notificación automática.
- **¿Cuánto cuesta?** 15GB gratuitos con credencial institucional UMSS. Plan Pro 50GB por Bs. 50/semestre vía QR Simple.

### 21.3 Internal FAQ

- **¿Por qué ahora?** Severidad máxima (nivel 4 en escala Nielsen) detectada en campo; 100% de estudiantes técnicos no puede entregar por Moodle y los docentes acumulan disputas sin evidencia verificable.
- **¿Por qué LTI 1.3 y no una integración propia?** LTI 1.3 es el estándar global (mismo que usa Turnitin, Khan Academy, Coursera). Garantiza interoperabilidad con cualquier LMS compatible sin mantener conectores propietarios frágiles.
- **¿Cuál es el retorno?** ~$10,000 USD de ahorro en H/H docentes en Año 1; eliminación del riesgo legal de incumplimiento Ley 164; modelo Freemium proyecta autofinanciamiento en Año 2.
- **¿Cómo escalamos?** Arquitectura multi-tenant (SCaaS) permite incorporar otras universidades bolivianas sin rediseño del núcleo. SCaaS Tier 2 federated o Tier 3 cloud para instituciones sin DTIC propio.

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
