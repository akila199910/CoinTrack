import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

function cookieExtractor(req: Request) {
  const name = (process.env.COOKIE_NAME as string) || 'access_token';
  return req?.cookies?.[name] || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; role: string }) {
    return { sub: payload.sub, role: payload.role };
  }
}
