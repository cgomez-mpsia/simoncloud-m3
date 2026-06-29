import { LoginUseCase } from './login.use-case'
import { InvalidCredentialsError } from '../domain/invalid-credentials.error'
import type { AuthProviderPort } from '../domain/port/out/auth-provider.port'
import type { TokenIssuerPort } from '../domain/port/out/token-issuer.port'
import type { AuthenticatedUser } from '../domain/authenticated-user'

const user: AuthenticatedUser = { userId: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' }

describe('LoginUseCase', () => {
  it('returns a token and the user for valid credentials', async () => {
    const authProvider: AuthProviderPort = { authenticate: jest.fn().mockResolvedValue(user) }
    const tokenIssuer: TokenIssuerPort = { sign: jest.fn().mockReturnValue('signed.jwt'), verify: jest.fn() }
    const useCase = new LoginUseCase(authProvider, tokenIssuer)

    const result = await useCase.execute({ codigoSis: 'doc-001', password: 'demo' })

    expect(result).toEqual({ token: 'signed.jwt', user })
    expect(tokenIssuer.sign).toHaveBeenCalledWith(user)
  })

  it('throws InvalidCredentialsError when authentication fails', async () => {
    const authProvider: AuthProviderPort = { authenticate: jest.fn().mockResolvedValue(null) }
    const tokenIssuer: TokenIssuerPort = { sign: jest.fn(), verify: jest.fn() }
    const useCase = new LoginUseCase(authProvider, tokenIssuer)

    await expect(useCase.execute({ codigoSis: 'x', password: 'y' })).rejects.toBeInstanceOf(InvalidCredentialsError)
    expect(tokenIssuer.sign).not.toHaveBeenCalled()
  })
})
