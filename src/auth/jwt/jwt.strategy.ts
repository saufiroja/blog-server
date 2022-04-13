import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const { JWT_PUBLIC_KEY, JWT_ALGORITMN } = process.env;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync(JWT_PUBLIC_KEY, {
        encoding: 'utf8',
      }),
      algorithms: [JWT_ALGORITMN],
    });
  }

  validate(payload: any) {
    return {
      userId: payload.userId,
    };
  }
}
