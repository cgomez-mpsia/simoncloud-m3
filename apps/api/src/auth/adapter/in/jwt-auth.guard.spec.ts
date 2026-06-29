import { UnauthorizedException, type ExecutionContext } from '@nestjs/common'
import { JwtAuthGuard } from './jwt-auth.guard'
import type { TokenClaims, TokenIssuerPort } from '../../domain/port/out/token-issuer.port'

const claims: TokenClaims = { sub: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' }
const COOKIE = 'simoncloud_token'

interface FakeReq {
  cookies?: Record<string, string>
  headers: Record<string, string | string[] | undefined>
  user?: unknown
}

function ctx(req: FakeReq): ExecutionContext {
  return { switchToHttp: () => ({ getRequest: () => req }) } as unknown as ExecutionContext
}

describe('JwtAuthGuard', () => {
  it('accepts a valid token from the cookie and attaches claims', () => {
    const issuer: TokenIssuerPort = { sign: jest.fn(), verify: jest.fn().mockReturnValue(claims) }
    const guard = new JwtAuthGuard(issuer, COOKIE)
    const req: FakeReq = { cookies: { [COOKIE]: 'good.jwt' }, headers: {} }

    expect(guard.canActivate(ctx(req))).toBe(true)
    expect(req.user).toEqual(claims)
    expect(issuer.verify).toHaveBeenCalledWith('good.jwt')
  })

  it('accepts a Bearer token from the Authorization header', () => {
    const issuer: TokenIssuerPort = { sign: jest.fn(), verify: jest.fn().mockReturnValue(claims) }
    const guard = new JwtAuthGuard(issuer, COOKIE)
    const req: FakeReq = { headers: { authorization: 'Bearer good.jwt' } }

    expect(guard.canActivate(ctx(req))).toBe(true)
  })

  it('rejects when no token is present', () => {
    const issuer: TokenIssuerPort = { sign: jest.fn(), verify: jest.fn() }
    const guard = new JwtAuthGuard(issuer, COOKIE)
    expect(() => guard.canActivate(ctx({ headers: {} }))).toThrow(UnauthorizedException)
  })

  it('rejects when the token is invalid', () => {
    const issuer: TokenIssuerPort = {
      sign: jest.fn(),
      verify: jest.fn(() => {
        throw new Error('bad')
      }),
    }
    const guard = new JwtAuthGuard(issuer, COOKIE)
    const req: FakeReq = { cookies: { [COOKIE]: 'bad.jwt' }, headers: {} }
    expect(() => guard.canActivate(ctx(req))).toThrow(UnauthorizedException)
  })
})
