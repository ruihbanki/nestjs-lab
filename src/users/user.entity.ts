import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/clients/client.entity';
import { IsEmail, MinLength } from 'class-validator';
import { EntityBase } from 'src/utils/entity-base';

@Entity()
@ObjectType()
export class User extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Field()
  @IsEmail()
  @Column({ unique: true })
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

  @Field()
  @Column({ name: 'is_super', default: false })
  isSuper: boolean;

  @Field(() => [Client], { nullable: true })
  @ManyToMany(() => Client, (client) => client.users, { nullable: true })
  @JoinTable()
  clients?: Client[];
}
