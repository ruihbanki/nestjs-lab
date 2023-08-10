import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindProductsArgs {
  @Field({ nullable: true })
  withDeleted?: boolean;
}
