import { UnauthorizedException } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { InvalidCredentialsError } from '../../domain/invalid-credentials.error'
import type { LoginUseCase } from '../../application/login.use-case'

const COOKIE = 'simoncloud_token'

describe('AuthController', () => {
  it('logs in: sets an HttpOnly cookie and returns rol + nombre', async () => {
    const execute = jest.fn().mockResolvedValue({
      token: 'signed.jwt',
      user: { userId: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' },
    })
    const controller = new AuthController({ execute } as unknown as LoginUseCase, COOKIE)
    const cookie = jest.fn()

    const out = await controller.login({ codigoSis: 'doc-001', password: 'demo' }, { cookie })

    expect(out).toEqual({ rol: 'DOCENTE', nombre: 'Docente Demo' })
    expect(cookie).toHaveBeenCalledWith(COOKIE, 'signed.jwt', expect.objectContaining({ httpOnly: true, path: '/' }))
  })

  it('maps InvalidCredentialsError to 401', async () => {
    const execute = jest.fn().mockRejectedValue(new InvalidCredentialsError())
    const controller = new AuthController({ execute } as unknown as LoginUseCase, COOKIE)
    await expect(
      controller.login({ codigoSis: 'x', password: 'y' }, { cookie: jest.fn() }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('rethrows unexpected errors', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('boom'))
    const controller = new AuthController({ execute } as unknown as LoginUseCase, COOKIE)
    await expect(
      controller.login({ codigoSis: 'x', password: 'y' }, { cookie: jest.fn() }),
    ).rejects.toThrow('boom')
  })
})
