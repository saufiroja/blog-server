import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

export class SequelizeConfig implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    const { DB_NAME, DB_PORT, DB_HOST, DB_USER, DB_PASS } = process.env;
    return {
      dialect: 'postgres',
      database: DB_NAME,
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USER,
      password: DB_PASS,
      logging: false,
      autoLoadModels: true,
    };
  }
}
