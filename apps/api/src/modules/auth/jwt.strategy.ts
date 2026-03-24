import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  userId: number;
  academyId?: number;
  role?: string;
  type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'changeme',
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.userId) {
      throw new UnauthorizedException();
    }

    if (payload.type === 'TEMP_AUTH') {
      return { id: payload.userId, type: 'TEMP_AUTH' };
    }

    return {
      id: payload.userId,
      academyId: payload.academyId,
      role: payload.role,
    };
  }
}
