# `@simoncloud/design-system`

Design System de SimonCloud, **absorbido de `supabase-ds`** (ver
[ADR-0007](../../docs/adr/0007-absorcion-design-system-supabase-ds.md) y
[DD-SHELL-001](../../docs/design/DD-SHELL-001.md)).

- **Stack**: React 18 + TS + Tailwind v4 + Radix UI (+ Lucide aprobado, aún sin usar).
- **Arquitectura**: Atomic Design.
- **Tema**: **Supabase dark** (verde esmeralda) vía tokens CSS — re-tematizable sin tocar componentes.

## Estructura

```
libs/design-system/
  components/
    atoms/        Button, Badge, IconButton, AvatarLogo
    molecules/    Card, Alert, Tabs, SectionHeader, SidebarNavItem
    organisms/    Navbar, HeroSection
  tokens/         tokens.css (CSS vars) + index.ts (constantes TS)
  index.css       @import tailwind + tokens
  manifests/      manifiestos JSON de extracción (page-analyzer)
  sources/        .mhtml material fuente — GITIGNORED (no versionar)
```

## Uso (desde la app, p. ej. `apps/web`)

```ts
// una vez, en el entrypoint:
import '@simoncloud/design-system/index.css'

// componentes:
import Button from '@simoncloud/design-system/components/atoms/Button'
```

## Construir nuevos componentes (workflow de extracción)

1. Colocar la página descargada en `sources/<pagina>.mhtml` (gitignored).
2. `@ds-page-analyzer <pagina>.mhtml` → genera `manifests/<pagina>.json` (Haiku).
3. `@ds-component-builder <pagina>.json` → genera los `.tsx` en `components/` (Sonnet).
4. Revisar props/tipos.

> **Regla (ADR-0007)**: el DS es **infraestructura**. Los átomos nuevos no requieren un
> design doc por componente; basta registrar el prompt en `PROMPT_MAPPING.md` si modifican
> código. Cobertura ≥90% aplica a lógica de features; los componentes presentacionales
> llevan tests visuales/snapshot.
