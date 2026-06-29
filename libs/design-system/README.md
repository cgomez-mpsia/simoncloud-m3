# `@simoncloud/design-system`

Design System de SimonCloud, **absorbido de `supabase-ds`** (ver
[ADR-0007](../../docs/adr/0007-absorcion-design-system-supabase-ds.md) y
[DD-SHELL-001](../../docs/design/DD-SHELL-001.md)).

- **Stack**: React 18 + TS + Tailwind v4 + Radix UI (+ Lucide aprobado, aún sin usar).
- **Arquitectura**: Atomic Design.
- **Tema canónico**: **Supabase dark** (verde esmeralda) vía tokens CSS. El verde es el
  **original**; el rebranding por institución (p. ej. azul UMSS) es un **override manual de
  tokens por tenant** (ver "Rebranding por institución").

## Estructura

```
libs/design-system/
  components/
    atoms/        Button, Badge, IconButton, AvatarLogo, TextInput, SearchInput, Avatar, Logo
    molecules/    Card, Alert, Tabs, SectionHeader, SidebarNavItem, FormField, CopyButton, Breadcrumb
    organisms/    Navbar, HeroSection, Header
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

## Dos fuentes de componentes

| Fuente | Para qué |
|---|---|
| **Figma** (diseños propios) | Componentes específicos de SimonCloud (p. ej. el `Header` del shell). Se construyen a mano/composición; el PNG/Figma es **referencia de layout y validación**, NO fuente de valores. |
| **`.mhtml` Supabase** | Componentes que **no existen en Figma** (base: Input, Table, DropdownMenu, FileDropzone…). Se extraen con el workflow de abajo. |

## Construir nuevos componentes (workflow de extracción, fuente mhtml)

1. Colocar la página descargada en `sources/<pagina>.mhtml` (gitignored).
2. `@ds-page-analyzer <pagina>.mhtml` → genera `manifests/<pagina>.json` (Haiku).
3. `@ds-component-builder <pagina>.json` → genera los `.tsx` en `components/` (Sonnet).
4. Revisar props/tipos.

## Rebranding por institución (multi-tenant)

El DS **no tiene** módulo de theming, ni UI, ni switch en runtime. El verde (Supabase) es el
**look canónico**. Para desplegar en otra universidad se **sobrescriben manualmente los tokens
de marca** (`--brand-*`) — los componentes ya usan `var(--brand-*)`, así que el rebrand es
puramente CSS, sin tocar componentes.

```css
/* tokens.umss.css — override por tenant (UMSS = azul). Se importa DESPUÉS de tokens.css */
:root {
  --brand-default: #1E90FF;   /* azul SimonCloud / UMSS */
  --brand-500:     #0F52BA;
  --brand-link:    #1E90FF;
  /* superficies/neutros Supabase dark se mantienen */
}
```

- **Canónico** (`tokens.css`): verde — no se toca.
- **Tenant** (`tokens.umss.css`, etc.): override de `--brand-*` aplicado al instalar.
- Sin `data-theme`, sin toggle: un tenant = un set de overrides importado en el build de su app.

## Convención Radix (cuándo sí, cuándo no)

Radix = **comportamiento + accesibilidad**, no estilo. Igual que Supabase/shadcn:
*Radix headless + clases Supabase encima*.

- **Puro** (HTML + Tailwind) si el componente **solo se ve**: Button, Badge, Card, Input,
  breadcrumb, empty-state, skeleton, metric-card, copy-button, form-field.
- **Radix** si **abre/cierra, atrapa foco, navega con teclado o vive en overlay**:
  Dialog/Modal, DropdownMenu, Tabs, Tooltip, Popover, Select, Switch, Checkbox, Accordion.
- **Fidelidad Supabase**: al usar Radix, el estilo SIEMPRE sale del manifiesto
  (`cssClasses`/`htmlSample`) + tokens; se aplica a cada parte de Radix. Nunca el look por
  defecto, nunca inventar valores. No retrofitear Radix en componentes puros.

Estado actual: `Tabs` y `Navbar` usan Radix; el resto es puro — el patrón correcto.

> **Regla (ADR-0007)**: el DS es **infraestructura**. Los átomos nuevos no requieren un
> design doc por componente; basta registrar el prompt en `PROMPT_MAPPING.md` si modifican
> código. Cobertura ≥90% aplica a lógica de features; los componentes presentacionales
> llevan tests visuales/snapshot.
