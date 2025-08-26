// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  private cookieName: string;
  private cookieMaxAgeMs: number;
  constructor( private readonly usersService: UsersService, private readonly jwt: JwtService, private readonly cfg: ConfigService){
    this.cookieName = this.cfg.get('COOKIE_NAME') || 'access_token';
    this.cookieMaxAgeMs = 15 * 60 * 1000;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return null;

    const ok = await bcrypt.compare(password, (user as any).password);
    if (!ok) return null;

    delete (user as any).password;
    return user;
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
        errors: {
          email: ['Invalid email or password'],
          password: ['Invalid email or password'],
        },
      });
    }

    const payload = { sub: user.id, role: user.role };
    const token = this.jwt.sign(payload);

    res.cookie(this.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax', 
      secure: false,
      maxAge: this.cookieMaxAgeMs,
      path: '/',
    });

    return  {user, message: 'Login successful'} ;
  }

  logout(res: Response) {
    res.clearCookie(this.cookieName, { path: '/' });
    return { message: 'Logged out' };
  }
}
