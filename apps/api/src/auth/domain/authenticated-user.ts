import type { Rol } from './rol'

// A user successfully authenticated by an AuthProvider (before issuing the JWT).
export interface AuthenticatedUser {
  userId: string
  rol: Rol
  nombre: string
}
