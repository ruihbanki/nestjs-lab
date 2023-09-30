import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CountriesModule } from './countries/countries.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { AppTypeormModule } from './app-typeorm.module';
import { ConfigModule } from './config/config.module';

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
    ProductCategoriesModule,
    ProductsModule,
  ],
  providers: [],
})
export class AppModule {}
