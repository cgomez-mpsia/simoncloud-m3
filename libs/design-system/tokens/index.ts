export const colors = {
  backgroundDefault: 'var(--background-default)',
  backgroundSurface75: 'var(--background-surface-75)',
  backgroundSurface100: 'var(--background-surface-100)',
  backgroundSurface200: 'var(--background-surface-200)',
  backgroundSurface300: 'var(--background-surface-300)',
  foregroundDefault: 'var(--foreground-default)',
  foregroundLight: 'var(--foreground-light)',
  foregroundLighter: 'var(--foreground-lighter)',
  foregroundMuted: 'var(--foreground-muted)',
  borderDefault: 'var(--border-default)',
  borderStrong: 'var(--border-strong)',
  borderStronger: 'var(--border-stronger)',
  borderMuted: 'var(--border-muted)',
  brand900: 'var(--brand-900)',
  brand1200: 'var(--brand-1200)',
} as const

export const fontFamily = {
  sans: 'var(--font-family)',
  mono: 'var(--font-family-mono)',
} as const

export type ColorToken = keyof typeof colors
