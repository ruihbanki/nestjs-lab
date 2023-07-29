import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CountryInput {
  @Field()
  id: string;
}
