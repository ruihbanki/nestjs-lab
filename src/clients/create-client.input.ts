import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateClientInput {
  @Field()
  name: string;

  @Field()
  domain: string;

  @Field({ nullable: true })
  website?: string;
}
