import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../models/User.models';
import { MailService } from './mail.service';

const { USER, PASS } = process.env;

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: USER,
          pass: PASS,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
