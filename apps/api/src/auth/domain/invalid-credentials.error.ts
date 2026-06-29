// Domain error: raised when authentication fails. The inbound adapter maps it
// to HTTP 401 (the domain stays framework-agnostic).
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials')
    this.name = 'InvalidCredentialsError'
  }
}
