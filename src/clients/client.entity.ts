import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { EntityBase } from 'src/utils/entity-base';
import { Country } from 'src/countries/country.entity';

@Entity()
@ObjectType()
export class Client extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  domain: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Country)
  @ManyToOne(() => Country)
  country: Country;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.clients, { nullable: true })
  users?: User[];
}
