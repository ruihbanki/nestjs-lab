import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateClientInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  domain: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
