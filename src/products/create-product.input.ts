import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field(() => [CategoryInput])
  categories: CategoryInput[];
}

@InputType()
class CategoryInput {
  @Field()
  productCategoryId: string;
}
