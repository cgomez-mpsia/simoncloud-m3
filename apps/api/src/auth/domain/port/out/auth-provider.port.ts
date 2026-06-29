import type { AuthenticatedUser } from '../../authenticated-user'

export interface Credentials {
  codigoSis: string
  password: string
}

// Outbound port: authenticates credentials against an identity provider.
// v1 is fulfilled by a stub of WebSISS; replaceable by the real OAuth2 adapter
// (ADR-0002) without touching the application layer.
export interface AuthProviderPort {
  authenticate(credentials: Credentials): Promise<AuthenticatedUser | null>
}

// DI token (kept in the domain so it stays framework-agnostic).
export const AUTH_PROVIDER = Symbol('AuthProviderPort')
