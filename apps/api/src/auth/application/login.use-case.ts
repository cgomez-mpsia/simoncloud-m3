import { Inject, Injectable } from '@nestjs/common'
import { AUTH_PROVIDER, type AuthProviderPort, type Credentials } from '../domain/port/out/auth-provider.port'
import { TOKEN_ISSUER, type TokenIssuerPort } from '../domain/port/out/token-issuer.port'
import type { AuthenticatedUser } from '../domain/authenticated-user'
import { InvalidCredentialsError } from '../domain/invalid-credentials.error'

export interface LoginResult {
  token: string
  user: AuthenticatedUser
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_PROVIDER) private readonly authProvider: AuthProviderPort,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuerPort,
  ) {}

  async execute(credentials: Credentials): Promise<LoginResult> {
    const user = await this.authProvider.authenticate(credentials)
    if (!user) {
      throw new InvalidCredentialsError()
    }
    const token = this.tokenIssuer.sign(user)
    return { token, user }
  }
}
