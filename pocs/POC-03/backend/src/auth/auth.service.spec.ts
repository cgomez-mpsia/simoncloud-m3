import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from './ports/user-repository.port';

const MOCK_USER = {
  id: 'user-uuid-001',
  name: 'Ana Docente',
  email: 'ana@umss.edu.bo',
  role: 'DOCENTE',
  password: 'hashed_pass',
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<UserRepositoryPort>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    userRepo = { findByEmail: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('jwt.token.mock') } as any;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY_PORT, useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('login()', () => {
    it('retorna token y datos del usuario con credenciales correctas', async () => {
      userRepo.findByEmail.mockResolvedValue(MOCK_USER);

      const result = await service.login('ana@umss.edu.bo', 'hashed_pass');

      expect(result.token).toBe('jwt.token.mock');
      expect(result.user.email).toBe('ana@umss.edu.bo');
      expect(result.user.role).toBe('DOCENTE');
      // Nunca exponer password en la respuesta
      expect((result.user as any).password).toBeUndefined();
    });

    it('firma el JWT con sub, email, role y name', async () => {
      userRepo.findByEmail.mockResolvedValue(MOCK_USER);
      await service.login('ana@umss.edu.bo', 'hashed_pass');

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-uuid-001',
        email: 'ana@umss.edu.bo',
        role: 'DOCENTE',
        name: 'Ana Docente',
      });
    });

    it('lanza UnauthorizedException si el usuario no existe', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(service.login('noexiste@umss.edu.bo', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('lanza UnauthorizedException si la contraseña es incorrecta', async () => {
      userRepo.findByEmail.mockResolvedValue(MOCK_USER);
      await expect(service.login('ana@umss.edu.bo', 'wrong_pass')).rejects.toThrow(UnauthorizedException);
    });
  });
});
