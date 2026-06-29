import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { TokenClaims } from '../../domain/port/out/token-issuer.port'

// Injects the authenticated user claims attached by JwtAuthGuard.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenClaims => {
    const req = ctx.switchToHttp().getRequest<{ user: TokenClaims }>()
    return req.user
  },
)
