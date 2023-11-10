import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BuyProductInput {
  @Field()
  productId: string;

  @Field()
  userId: string;
}
