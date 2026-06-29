import { Body, Controller, HttpCode, Inject, Post, Res, UnauthorizedException } from '@nestjs/common'
import { LoginUseCase } from '../../application/login.use-case'
import { InvalidCredentialsError } from '../../domain/invalid-credentials.error'
import { LoginDto } from './dto/login.dto'
import { AUTH_COOKIE } from './jwt-auth.guard'

// Minimal shape of the cookie setter we rely on (express Response.cookie).
interface ResponseLike {
  cookie(name: string, value: string, options: Record<string, unknown>): void
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    @Inject(AUTH_COOKIE) private readonly cookieName: string,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: ResponseLike) {
    try {
      const { token, user } = await this.loginUseCase.execute({
        codigoSis: dto.codigoSis,
        password: dto.password,
      })
      res.cookie(this.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })
      return { rol: user.rol, nombre: user.nombre }
    } catch (e) {
      if (e instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Credenciales incorrectas. Verifica tu código SIS.')
      }
      throw e
    }
  }
}
