import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ClientTokenDTO {
  @Field()
  token: string;
}
