import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientsResolver } from './clients.resolver';
import { ClientsService } from './clients.service';
import { ClientContact } from 'src/client-contacts/client-contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    TypeOrmModule.forFeature([ClientContact]),
  ],
  providers: [ClientsResolver, ClientsService],
})
export class ClientsModule {}
