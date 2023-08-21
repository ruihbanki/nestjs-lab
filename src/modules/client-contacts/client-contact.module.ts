import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientContact } from './client-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientContact])],
})
export class ClientContactModule {}
