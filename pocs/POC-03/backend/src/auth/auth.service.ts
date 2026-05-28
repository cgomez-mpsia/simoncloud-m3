import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
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
