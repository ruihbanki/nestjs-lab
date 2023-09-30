import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductCategoryInput {
  @Field()
  name: string;
}
