import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  CreateClientContactInput,
  CreateClientInput,
} from './create-client.input';

@InputType()
export class UpdateClientInput extends OmitType(
  PartialType(CreateClientInput),
  ['domain', 'contacts'],
) {
  @Field(() => [UpdateClientContactInput], { nullable: true })
  contacts?: UpdateClientContactInput[];
}

@InputType()
export class UpdateClientContactInput extends CreateClientContactInput {
  @Field({ nullable: true })
  clientContactId?: string;
}
