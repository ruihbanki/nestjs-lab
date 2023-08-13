import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

export interface IAppConfigService {
  DATABASE_TYPE: DatabaseType;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class AppConfigModule {}
