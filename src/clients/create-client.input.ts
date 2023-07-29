import { Field, InputType } from '@nestjs/graphql';
import { CountryInput } from 'src/countries/country.input';

@InputType()
export class CreateClientInput {
  @Field()
  name: string;

  @Field()
  domain: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  country: CountryInput;
}
