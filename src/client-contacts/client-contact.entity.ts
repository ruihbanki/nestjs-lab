import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityBase } from 'src/utils/entity-base';
import { MinLength } from 'class-validator';
import { Client } from 'src/clients/client.entity';

@Entity()
@ObjectType()
export class ClientContact extends EntityBase {
  @Field(() => ID)
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
