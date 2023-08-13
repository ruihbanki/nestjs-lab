import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CountriesModule } from './countries/countries.module';
import { ProductsModule } from './products/products.module';
import { AppTypeormModule } from './app-typeorm.module';
import { AppConfigModule } from './app-config.module';

@Module({
  imports: [
    AppConfigModule,
    AppTypeormModule,
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
