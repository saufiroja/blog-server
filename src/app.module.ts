import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { SequelizeConfig } from './config/sequelize.config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig,
    }),
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
