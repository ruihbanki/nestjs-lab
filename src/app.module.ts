import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CountriesModule } from './countries/countries.module';
import { ProductsModule } from './products/products.module';
import { ClientContactModule } from './client-contacts/client-contact.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ClientsModule,
    UsersModule,
    CountriesModule,
    ProductsModule,
    ClientContactModule,
  ],
  providers: [],
})
export class AppModule {}
