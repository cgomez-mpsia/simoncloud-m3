import { StubWebSissAuthProvider } from './stub-websiss.auth-provider'

describe('StubWebSissAuthProvider', () => {
  const provider = new StubWebSissAuthProvider()

  it('authenticates a valid DOCENTE and returns the user', async () => {
    const user = await provider.authenticate({ codigoSis: 'doc-001', password: 'demo' })
    expect(user).toEqual({ userId: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' })
  })

  it('authenticates a valid ESTUDIANTE', async () => {
    const user = await provider.authenticate({ codigoSis: 'est-001', password: 'demo' })
    expect(user?.rol).toBe('ESTUDIANTE')
  })

  it('returns null for a wrong password', async () => {
    expect(await provider.authenticate({ codigoSis: 'doc-001', password: 'wrong' })).toBeNull()
  })

  it('returns null for an unknown user', async () => {
    expect(await provider.authenticate({ codigoSis: 'nope', password: 'demo' })).toBeNull()
  })
})
