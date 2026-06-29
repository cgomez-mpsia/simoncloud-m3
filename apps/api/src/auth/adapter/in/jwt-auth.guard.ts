import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { TOKEN_ISSUER, type TokenIssuerPort } from '../../domain/port/out/token-issuer.port'

// DI token for the auth cookie name (provided from env in the module).
export const AUTH_COOKIE = Symbol('AuthCookieName')

interface RequestLike {
  cookies?: Record<string, string>
  headers: Record<string, string | string[] | undefined>
  user?: unknown
}

// Validates the session JWT (cookie or Bearer header) via the TokenIssuerPort
// and attaches the claims to the request. Rejects with 401 on missing/invalid.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuerPort,
    @Inject(AUTH_COOKIE) private readonly cookieName: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestLike>()
    const token = this.extractToken(req)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      req.user = this.tokenIssuer.verify(token)
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractToken(req: RequestLike): string | null {
    const fromCookie = req.cookies?.[this.cookieName]
    if (fromCookie) return fromCookie
    const auth = req.headers['authorization']
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      return auth.slice(7)
    }
    return null
  }
}
