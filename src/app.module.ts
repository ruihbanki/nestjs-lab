import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CountriesModule } from './modules/countries/countries.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppTypeormModule } from './app-typeorm.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [
    ConfigModule,
    AppTypeormModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    AuthModule,
    ClientsModule,
    UsersModule,
    CountriesModule,
    ProductsModule,
  ],
  providers: [],
})
export class AppModule {}
