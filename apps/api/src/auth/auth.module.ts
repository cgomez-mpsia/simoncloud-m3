import { Module } from '@nestjs/common'
import { AuthController } from './adapter/in/auth.controller'
import { AUTH_COOKIE, JwtAuthGuard } from './adapter/in/jwt-auth.guard'
import { LoginUseCase } from './application/login.use-case'
import { AUTH_PROVIDER } from './domain/port/out/auth-provider.port'
import { TOKEN_ISSUER } from './domain/port/out/token-issuer.port'
import { StubWebSissAuthProvider } from './adapter/out/stub-websiss.auth-provider'
import { JwtIssuer, JWT_ISSUER_CONFIG, type JwtIssuerConfig } from './adapter/out/jwt.issuer'

@Module({
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtAuthGuard,
    { provide: AUTH_PROVIDER, useClass: StubWebSissAuthProvider },
    { provide: AUTH_COOKIE, useFactory: () => process.env.AUTH_COOKIE_NAME ?? 'simoncloud_token' },
    {
      provide: JWT_ISSUER_CONFIG,
      useFactory: (): JwtIssuerConfig => ({
        // env PEM may carry literal \n — normalize to real newlines
        privateKey: (process.env.AUTH_JWT_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
        publicKey: (process.env.AUTH_JWT_PUBLIC_KEY ?? '').replace(/\\n/g, '\n'),
        ttlSeconds: Number(process.env.AUTH_JWT_TTL_SECONDS ?? 28800),
      }),
    },
    {
      provide: TOKEN_ISSUER,
      useFactory: (cfg: JwtIssuerConfig) => new JwtIssuer(cfg),
      inject: [JWT_ISSUER_CONFIG],
    },
  ],
  // exported so other modules (drops/file/external) can protect routes
  exports: [JwtAuthGuard, TOKEN_ISSUER, AUTH_COOKIE],
})
export class AuthModule {}
