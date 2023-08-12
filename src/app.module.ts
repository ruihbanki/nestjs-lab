import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataSource } from 'typeorm';

import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CountriesModule } from './countries/countries.module';
import { ProductsModule } from './products/products.module';

// useFactory: (configService: ConfigService) => ({

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'nestjs-lab',
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
