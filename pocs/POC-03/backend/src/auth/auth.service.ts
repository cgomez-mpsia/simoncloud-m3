import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from './ports/user-repository.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepo: UserRepositoryPort,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
