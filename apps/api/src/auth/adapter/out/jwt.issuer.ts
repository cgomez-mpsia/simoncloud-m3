import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from '../../domain/authenticated-user'
import type { TokenClaims, TokenIssuerPort } from '../../domain/port/out/token-issuer.port'
import { isRol } from '../../domain/rol'

export interface JwtIssuerConfig {
  /** RS256 private key (PEM) — from Vault/env, never hardcoded */
  privateKey: string
  /** RS256 public key (PEM) */
  publicKey: string
  ttlSeconds: number
}

// DI token for the config object (provided from env in the module).
export const JWT_ISSUER_CONFIG = Symbol('JwtIssuerConfig')

// Concrete TokenIssuerPort using JWT RS256 (asymmetric): sign with the private
// key, verify with the public key (coherent with the API gateway design, DTI §3).
export class JwtIssuer implements TokenIssuerPort {
  constructor(private readonly config: JwtIssuerConfig) {}

  sign(user: AuthenticatedUser): string {
    return jwt.sign({ rol: user.rol, nombre: user.nombre }, this.config.privateKey, {
      algorithm: 'RS256',
      subject: user.userId,
      expiresIn: this.config.ttlSeconds,
    })
  }

  verify(token: string): TokenClaims {
    const payload = jwt.verify(token, this.config.publicKey, { algorithms: ['RS256'] })
    if (typeof payload === 'string' || !payload.sub || typeof payload.rol !== 'string' || !isRol(payload.rol)) {
      throw new Error('Invalid token payload')
    }
    return { sub: payload.sub, rol: payload.rol, nombre: String(payload.nombre ?? '') }
  }
}
