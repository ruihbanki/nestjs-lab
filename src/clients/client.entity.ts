import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
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
  @Column({ unique: true })
  domain: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Country)
  @ManyToOne(() => Country, { nullable: false })
  country: Country;
}
