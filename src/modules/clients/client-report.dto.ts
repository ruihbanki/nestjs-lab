import { Entity } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class ClientReport {
  @Field(() => ID)
  clientId: string;

  @Field()
  clientName: string;

  @Field()
  countryName: string;
}
