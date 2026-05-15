# Tarea: Clean Architecture Aplicada a SimonCloud
## R.C. Martin – *Clean Architecture: A Craftsman's Guide to Software Structure and Design*

> **Capítulos de referencia:** The Dependency Rule (Cap. 22) · Ports & Adapters / Hexagonal Architecture (Cap. 22 §Humble Object Pattern + referencia directa en la Parte V)
> **Contexto del producto:** SimonCloud – plataforma SCaaS para la UMSS

---

## Parte 1 – Síntesis de los Conceptos

### 1.1 La "Dependency Rule" (Regla de Dependencia)

Martin organiza el software en **capas concéntricas** (los "círculos" de la Arquitectura Limpia):

```
┌─────────────────────────────────────────┐
│         Frameworks & Drivers             │  ← Capa más externa
│  (UI, DB, APIs externas, Web Framework) │
├─────────────────────────────────────────┤
│     Interface Adapters (Adaptadores)     │
│  (Controllers, Presenters, Gateways)    │
├─────────────────────────────────────────┤
│       Application Business Rules         │
│         (Use Cases / Interactors)        │
├─────────────────────────────────────────┤
│       Enterprise Business Rules          │  ← Capa más interna
│             (Entities / Domain)          │
└─────────────────────────────────────────┘
```

**La Regla de Dependencia establece:**
> *"Las dependencias del código fuente sólo pueden apuntar hacia adentro. Ningún elemento de un círculo interior debe conocer nada de un elemento de un círculo exterior."*

En términos prácticos:

| Lo que **NO** puede pasar | Lo que **SÍ** puede pasar |
|--------------------------|--------------------------|
| Una Entidad importa un modelo de base de datos | Un Use Case invoca métodos de una Entidad |
| Un Use Case sabe que se usa Express.js o PostgreSQL | Un Adaptador implementa una interfaz definida en el dominio |
| El dominio conoce el ORM (Sequelize, Prisma, etc.) | El Framework depende de los Adaptadores |

El propósito es que el **núcleo de negocio (Entities + Use Cases) nunca cambie** cuando se reemplaza la base de datos, el framework web o una API externa.

---

### 1.2 Puertos & Adaptadores (Hexagonal Architecture)

Propuesta originalmente por Alistair Cockburn e incorporada por Martin como la materialización práctica de la Dependency Rule, este patrón divide el sistema en:

```
                        ┌────────────────────────────────┐
     DRIVING SIDE        │                                │   DRIVEN SIDE
  (quien usa el sistema)│          DOMINIO CORE          │  (de quien depende el sistema)
                        │   Entities + Use Cases         │
  UI / REST Controller ─┤                                ├─► IFileRepository (Puerto)
  Test Harness          │   define Puertos (interfaces)  │       ↑
  CLI                   │                                │   PostgresFileRepo (Adaptador)
                        └────────────────────────────────┘   S3FileStore (Adaptador)
                                                              MoodleGateway (Adaptador)
```

- **Puerto (Port):** Interfaz/contrato definido *dentro* del dominio. Describe lo que el dominio *necesita* sin saber cómo se implementa.
  Ejemplo: `IEntregaRepository`, `IHashCalculator`, `INotificacionSender`.

- **Adaptador (Adapter):** Implementación concreta de un Puerto que vive en la capa externa. Habla con la tecnología real (Postgres, S3, Moodle API, SMTP).
  Ejemplo: `PostgresEntregaRepository implements IEntregaRepository`.

**Beneficio clave:** El dominio puede ser probado **sin infraestructura real** — se usa un adaptador falso (mock/stub) que implementa el mismo Puerto.

---

## Parte 2 – Dominio Core de SimonCloud

### 2.1 Identificación del Dominio (1 frase)

> **SimonCloud gestiona la entrega verificable de archivos académicos y la consolidación de calificaciones institucionales, garantizando la integridad e inmutabilidad de los datos como fuente de verdad académica de la UMSS.**

---

### 2.2 Las 3 Entidades Principales del Dominio

Siguiendo la Dependency Rule, las **Entities** son los objetos de negocio que encapsulan las reglas más estables y críticas del sistema. No dependen de frameworks, bases de datos ni APIs externas.

---

#### Entidad 1 — `Entrega`

| Campo | Detalle |
|-------|---------|
| **Qué representa** | Un archivo subido por un estudiante a un buzón de tarea (SimonDrop). Es el artefacto central de la interacción académica. |
| **Reglas de negocio que encapsula** | 1. Una `Entrega` solo puede crearse si el `SimonDrop` asociado está abierto (no ha vencido). 2. Al ser creada, genera un `hash SHA-256` del contenido que queda inmutablemente ligado a ella. 3. Una vez que el `SimonDrop` se cierra, la `Entrega` pasa a estado `BLOQUEADA`: ningún agente externo puede modificar su contenido. |
| **Atributos clave** | `id`, `archivoUrl`, `hashSHA256`, `fechaEntrega`, `estado (PENDIENTE / BLOQUEADA)`, `estudianteId`, `simonDropId` |
| **Por qué pertenece al dominio** | La inmutabilidad y el hash son garantías **legales y académicas** — la regla más valiosa del sistema y la razón de existir de SimonCloud. |

---

#### Entidad 2 — `SimonDrop`

| Campo | Detalle |
|-------|---------|
| **Qué representa** | El buzón de recepción de archivos creado por un docente. Define el contexto, las restricciones y el ciclo de vida de las entregas. |
| **Reglas de negocio que encapsula** | 1. Solo puede ser creado por un usuario con rol `DOCENTE` en el contexto de una materia asignada. 2. Tiene una `fechaLimite`; pasada esa fecha, su estado cambia automáticamente a `CERRADO` y no acepta más entregas. 3. Puede definir restricciones de formato (ej. solo PDF) y tamaño máximo. 4. Al cerrarse, dispara el evento `SimonDropCerrado` que bloquea todas sus `Entregas`. |
| **Atributos clave** | `id`, `titulo`, `descripcion`, `fechaLimite`, `estado (ABIERTO / CERRADO)`, `formatosPermitidos[]`, `tamañoMaximoMB`, `docenteId`, `materiaId` |
| **Por qué pertenece al dominio** | Concentra las reglas que determinan cuándo y cómo se puede entregar un trabajo — son reglas de negocio académico puras, independientes de la tecnología. |

---

#### Entidad 3 — `ActaConsolidada`

| Campo | Detalle |
|-------|---------|
| **Qué representa** | El registro unificado de calificaciones de un estudiante en una materia, resultado de homologar notas de múltiples LMS (Moodle, Classroom) a la escala oficial de la UMSS (0–100). |
| **Reglas de negocio que encapsula** | 1. Las notas se identifican por `correoInstitucional (@umss.edu.bo)` para deduplicar el mismo alumno en distintos LMS. 2. La conversión de escala es determinista: `/50 → ×2` (Moodle) y letra `A=100, B=85, C=70, D=55, F=0` (Classroom). 3. Una vez que el docente cierra el acta (`estado = CERRADA`), ninguna nota puede alterarse sin solicitud formal del perfil `ADMINISTRATIVO`. 4. Cada parcial guarda la trazabilidad de origen (`lmsOrigen`). |
| **Atributos clave** | `id`, `estudianteId`, `materiaId`, `notaFinal`, `estado (BORRADOR / CERRADA)`, `periodoAcademico`, `parciales[{evaluacionId, nota, lmsOrigen}]` |
| **Por qué pertenece al dominio** | La deduplicación por correo y la lógica de homologación son las **reglas de negocio más críticas del sistema**: cualquier error afecta el historial académico oficial de un estudiante. |

---

## Parte 3 – Aplicación al Stack de SimonCloud

### 3.1 Mapa de Capas Clean Architecture → SimonCloud

```
┌──────────────────────────────────────────────────────────────────┐
│  FRAMEWORKS & DRIVERS                                            │
│  • NestJS (HTTP Framework)    • PostgreSQL (Driver)              │
│  • React SPA (UI)             • MinIO / S3 SDK                   │
│  • Moodle REST API Client     • Google Classroom API Client      │
│  • QR Simple SDK              • Redis Client                     │
└──────────────────────┬───────────────────────────────────────────┘
                       │ depende de ↑ (pero dominio NO sabe de esto)
┌──────────────────────▼───────────────────────────────────────────┐
│  INTERFACE ADAPTERS (Adaptadores)                                │
│  • SimonDropController (REST → Use Case)                         │
│  • EntregaController (REST → Use Case)                           │
│  • PostgresEntregaRepository implements IEntregaRepository       │
│  • S3FileStorage implements IFileStorage                         │
│  • MoodleGateway implements ICalificacionesLMS                   │
│  • ClassroomGateway implements ICalificacionesLMS                │
│  • QRSimpleGateway implements IPasarelaPago                      │
└──────────────────────┬───────────────────────────────────────────┘
                       │ depende de ↑
┌──────────────────────▼───────────────────────────────────────────┐
│  APPLICATION BUSINESS RULES (Use Cases)                          │
│  • CrearSimonDropUseCase                                         │
│  • SubirEntregaUseCase (calcula hash, valida estado SimonDrop)   │
│  • ConsolidarCalificacionesUseCase (dedup, homologación)         │
│  • CerrarSimonDropUseCase (bloquea entregas, emite evento)       │
│  • AutenticarUsuarioUseCase (valida con WebSISS vía puerto)      │
└──────────────────────┬───────────────────────────────────────────┘
                       │ depende de ↑
┌──────────────────────▼───────────────────────────────────────────┐
│  ENTERPRISE BUSINESS RULES (Entities — Dominio Core)             │
│  • Entrega (hash inmutable, regla de bloqueo)                    │
│  • SimonDrop (fecha límite, formatos, ciclo de vida)             │
│  • ActaConsolidada (dedup identidad, homologación, cierre)       │
│                                                                  │
│  PUERTOS (Interfaces definidas aquí):                            │
│  • IEntregaRepository   • IFileStorage   • IHashCalculator       │
│  • ICalificacionesLMS   • IPasarelaPago  • INotificacionSender   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Ejemplo Concreto: Dependency Rule en `SubirEntregaUseCase`

```typescript
// ✅ CORRECTO — El Use Case solo depende de interfaces (Puertos)
// No importa Prisma, S3, NestJS ni nada externo.

// Puertos definidos en el DOMINIO:
interface IFileStorage {
  guardar(buffer: Buffer, nombre: string): Promise<string>; // retorna URL
}
interface IHashCalculator {
  calcular(buffer: Buffer): string; // SHA-256
}
interface IEntregaRepository {
  guardar(entrega: Entrega): Promise<void>;
}

// Use Case (Application layer):
class SubirEntregaUseCase {
  constructor(
    private readonly storage: IFileStorage,       // Puerto
    private readonly hash: IHashCalculator,        // Puerto
    private readonly repo: IEntregaRepository,     // Puerto
  ) {}

  async ejecutar(simonDrop: SimonDrop, archivo: Buffer, estudianteId: string): Promise<Entrega> {
    if (simonDrop.estado !== 'ABIERTO') {
      throw new Error('El SimonDrop está cerrado. No se aceptan más entregas.');
    }
    const hashSHA256 = this.hash.calcular(archivo);     // Regla de negocio pura
    const url = await this.storage.guardar(archivo, hashSHA256);
    const entrega = new Entrega({ archivoUrl: url, hashSHA256, estudianteId, simonDropId: simonDrop.id });
    await this.repo.guardar(entrega);
    return entrega;
  }
}
// El adaptador S3FileStorage (capa externa) implementa IFileStorage.
// Si mañana cambiamos de S3 a Azure Blob, el Use Case y las Entities NO cambian.
```

---

## Referencias

| Fuente | Capítulo / Sección |
|--------|-------------------|
| Martin, R.C. (2017). *Clean Architecture*. Pearson. | Cap. 22: The Clean Architecture |
| Martin, R.C. (2017). *Clean Architecture*. Pearson. | Cap. 23: Presenters and Humble Objects |
| Cockburn, A. (2005). *Hexagonal Architecture*. alistair.cockburn.us | — |
| SimonCloud – `old-docs/simoncloud.md` | §3 Roles, §4 Funcionalidades |
| SimonCloud – `docs/PRD_v1.md` | §5 User Stories, §7 Requerimientos |
| SimonCloud – `docs/dti/DTI_borrador.md` | §1 Arquitectura C4 Nivel 1 |
