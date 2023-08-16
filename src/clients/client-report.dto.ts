import { Entity } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class ClientReportDto {
  @Field(() => ID)
  clientId: string;

  @Field()
  name: string;

  @Field()
  usersCount: number;
}
