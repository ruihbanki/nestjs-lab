import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataSource } from 'typeorm';

import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CountriesModule } from './countries/countries.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAppConfigService } from './app-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IAppConfigService>) => ({
        type: configService.get('DATABASE_TYPE') as any,
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME') as string,
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ClientsModule,
    UsersModule,
    CountriesModule,
    ProductsModule,
  ],
  providers: [],
})
export class AppModule {}
