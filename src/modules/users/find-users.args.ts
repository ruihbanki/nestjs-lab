import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindUsersArgs {
  @Field({ nullable: true })
  withDeleted?: boolean;
}
