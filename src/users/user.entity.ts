import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/clients/client.entity';
import { IsEmail, MinLength } from 'class-validator';
import { EntityBase } from 'src/utils/entity-base';
import { UserType } from './user-type.enum';

@Entity()
@ObjectType()
@Index('IDX_username', ['client.clientId', 'username'], { unique: true })
export class User extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Field()
  @IsEmail()
  @Column()
  username: string;

  @Column()
  password: string;

  @Field()
  @MinLength(3)
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @Field()
  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => UserType)
  @Column({ name: 'user_type' })
  userType: UserType;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
