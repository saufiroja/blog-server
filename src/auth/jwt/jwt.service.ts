import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { Algorithm } from 'jsonwebtoken';

@Injectable()
export class JwtService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    const { JWT_ALGORITMN, JWT_PUBLIC_KEY, JWT_PRIVATE_KEY, JWT_EXPIRE_IN } =
      process.env;
    return {
      privateKey: readFileSync(JWT_PRIVATE_KEY, { encoding: 'utf-8' }),
      publicKey: readFileSync(JWT_PUBLIC_KEY, { encoding: 'utf-8' }),
      signOptions: {
        expiresIn: JWT_EXPIRE_IN,
        algorithm: JWT_ALGORITMN as Algorithm,
      },
    };
  }
}
