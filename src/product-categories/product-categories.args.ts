import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ProductCategoriesArgs {
  @Field({ nullable: true })
  withDeleted?: boolean;
}
