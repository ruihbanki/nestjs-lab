import { Injectable } from '@nestjs/common';
import { DatabaseType } from 'typeorm';
import { ConfigService as NestConfigService } from '@nestjs/config';

export interface AppVariable {
  DATABASE_TYPE: DatabaseType;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  JWT_SECRET_KEY: string;
}

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService<AppVariable>) {}

  get(name: keyof AppVariable) {
    return this.configService.get<keyof AppVariable>(name);
  }
}
