import { Injectable } from '@nestjs/common'
import type { AuthProviderPort, Credentials } from '../../domain/port/out/auth-provider.port'
import type { AuthenticatedUser } from '../../domain/authenticated-user'
import type { Rol } from '../../domain/rol'

interface SeedUser {
  codigoSis: string
  password: string
  userId: string
  rol: Rol
  nombre: string
}

// v1 stub of WebSISS (ADR-0008, delta #3). Stands in for the real IdP, which is
// not reachable; the real WebSISS OAuth2 adapter (ADR-0002) will implement the
// same AuthProviderPort. Seed credentials are for development only.
@Injectable()
export class StubWebSissAuthProvider implements AuthProviderPort {
  private readonly users: readonly SeedUser[] = [
    { codigoSis: 'doc-001', password: 'demo', userId: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' },
    { codigoSis: 'est-001', password: 'demo', userId: 'u-est-001', rol: 'ESTUDIANTE', nombre: 'Estudiante Demo' },
  ]

  async authenticate(credentials: Credentials): Promise<AuthenticatedUser | null> {
    const user = this.users.find(
      (u) => u.codigoSis === credentials.codigoSis && u.password === credentials.password,
    )
    if (!user) return null
    return { userId: user.userId, rol: user.rol, nombre: user.nombre }
  }
}
