import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
import { CountryInput } from 'src/modules/countries/country.input';

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

  @Field(() => [ClientContactInput])
  contacts: ClientContactInput[];
}

@InputType()
export class ClientContactInput {
  @Field()
  @MinLength(3)
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;
}
