import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRefreshToken } from '../models/UserRefreshToken.models';
import { MailService } from '../mail/mail.service';
import { User } from '../models/User.models';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SequelizeModule.forFeature([User, UserRefreshToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
