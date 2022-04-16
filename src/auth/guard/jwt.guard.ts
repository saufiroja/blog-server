import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { Algorithm, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let decodedToken: any;
    const req = context.switchToHttp().getRequest();
    const data: any = context.switchToRpc().getData();
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

    data.user = {
      id: decodedToken.userId,
      role: decodedToken.role,
    };

    return true;
  }
}
