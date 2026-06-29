// Institutional roles assigned by the SSO. Invariant: not editable by the user
// (CLAUDE.md §3). The E2E feature owner is a DOCENTE.
export const ROLES = ['ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO', 'ADMIN'] as const

export type Rol = (typeof ROLES)[number]

export function isRol(value: string): value is Rol {
  return (ROLES as readonly string[]).includes(value)
}
