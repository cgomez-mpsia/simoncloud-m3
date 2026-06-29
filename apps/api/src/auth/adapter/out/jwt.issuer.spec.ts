import { generateKeyPairSync } from 'crypto'
import jwt from 'jsonwebtoken'
import { JwtIssuer, type JwtIssuerConfig } from './jwt.issuer'
import type { AuthenticatedUser } from '../../domain/authenticated-user'

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

const user: AuthenticatedUser = { userId: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' }

function makeIssuer(ttlSeconds = 3600): JwtIssuer {
  const config: JwtIssuerConfig = { privateKey, publicKey, ttlSeconds }
  return new JwtIssuer(config)
}

describe('JwtIssuer (RS256)', () => {
  it('signs and verifies a token round-trip', () => {
    const issuer = makeIssuer()
    const token = issuer.sign(user)
    const claims = issuer.verify(token)
    expect(claims).toEqual({ sub: 'u-doc-001', rol: 'DOCENTE', nombre: 'Docente Demo' })
  })

  it('rejects a tampered token', () => {
    const issuer = makeIssuer()
    const token = issuer.sign(user) + 'tampered'
    expect(() => issuer.verify(token)).toThrow()
  })

  it('rejects an expired token', () => {
    const issuer = makeIssuer(-10)
    const token = issuer.sign(user)
    expect(() => issuer.verify(token)).toThrow()
  })

  it('rejects a token signed with a different algorithm (HS256)', () => {
    const issuer = makeIssuer()
    const hs = jwt.sign({ rol: 'DOCENTE', nombre: 'x' }, 'shared-secret', { algorithm: 'HS256', subject: 'u' })
    expect(() => issuer.verify(hs)).toThrow()
  })

  it('rejects a token with an invalid rol in the payload', () => {
    const issuer = makeIssuer()
    const bad = jwt.sign({ rol: 'HACKER', nombre: 'x' }, privateKey, { algorithm: 'RS256', subject: 'u' })
    expect(() => issuer.verify(bad)).toThrow('Invalid token payload')
  })
})
