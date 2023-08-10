import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CountryInput {
  @Field()
  countryId: string;
}
