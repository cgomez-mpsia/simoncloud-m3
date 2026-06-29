import type { AuthenticatedUser } from '../../authenticated-user'
import type { Rol } from '../../rol'

export interface TokenClaims {
  sub: string
  rol: Rol
  nombre: string
}

// Outbound port for issuing/verifying the session token. The concrete adapter
// uses JWT RS256 (DTI §3); the app/guard depend on this port, not on the lib.
export interface TokenIssuerPort {
  sign(user: AuthenticatedUser): string
  /** Verifies signature + expiration; throws on invalid/expired token. */
  verify(token: string): TokenClaims
}

export const TOKEN_ISSUER = Symbol('TokenIssuerPort')
