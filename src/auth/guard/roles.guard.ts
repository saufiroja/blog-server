import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { readFileSync } from 'fs';
import { Algorithm, verify } from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    let decodedToken: any;
    const req = context.switchToHttp().getRequest();
    const { headers } = req;
    const { JWT_PUBLIC_KEY, JWT_ALGORITMN } = process.env;

    const publicKey = readFileSync(JWT_PUBLIC_KEY, { encoding: 'utf-8' });
    try {
      const { authorization } = headers;
      const token = authorization.split(' ')[1];

      decodedToken = verify(token, publicKey, {
        algorithms: [JWT_ALGORITMN as Algorithm],
      });
    } catch (error) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    console.log(roles[0]);
    console.log(decodedToken);

    if (decodedToken.role !== roles[0]) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
