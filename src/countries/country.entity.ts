import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityBase } from 'src/utils/entity-base';

@Entity()
@ObjectType()
export class Country extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'country_id' })
  countryId: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  iso: string;
}
