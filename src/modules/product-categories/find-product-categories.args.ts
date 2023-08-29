import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindProductCategoriesArgs {
  @Field({ nullable: true })
  withDeleted?: boolean;
}
