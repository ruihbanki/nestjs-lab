import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
import { Client } from 'src/clients/client.entity';

@Entity()
@ObjectType()
export class ClientContact {
  @PrimaryGeneratedColumn('uuid', { name: 'client_contact_id' })
  clientContactId: string;

  @ManyToOne(() => Client, (client) => client.contacts)
  client: Client;

  @Field()
  @MinLength(3)
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @Field()
  @Column({ name: 'phone_number' })
  phoneNumber: string;
}
