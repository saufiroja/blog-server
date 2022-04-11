import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { SequelizeConfig } from './config/sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig,
    }),
    AuthModule,
  ],
})
export class AppModule {}
