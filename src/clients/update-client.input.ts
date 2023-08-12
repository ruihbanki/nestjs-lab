import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateClientInput } from './create-client.input';

@InputType()
export class UpdateClientInput extends OmitType(
  PartialType(CreateClientInput),
  ['domain'],
) {}
