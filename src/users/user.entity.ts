import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/clients/client.entity';
import { IsEmail, MinLength } from 'class-validator';
import { EntityBase } from 'src/utils/entity-base';

@Entity()
@ObjectType()
export class User extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsEmail()
  username: string;

  @Column()
  password: string;

  @Field()
  @Column()
  @MinLength(3)
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ nullable: true, insert: false, update: false })
  fullName: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isSuper: boolean;

  @Field(() => [Client], { nullable: true })
  @ManyToMany(() => Client, { nullable: true })
  @JoinTable()
  clients?: Client[];
}
