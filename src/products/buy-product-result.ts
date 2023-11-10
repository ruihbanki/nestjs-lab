import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

export const BuyProductResult = createUnionType({
  name: 'BuyProductResult',
  types: () => [BuyProductSuccess, BuyProductFail] as const,
});

@ObjectType()
export class BuyProductSuccess {
  constructor(clientId: string, productId: string) {
    this.clientId = clientId;
    this.productId = productId;
  }

  @Field()
  clientId: string;

  @Field()
  productId: string;
}

@ObjectType()
export class BuyProductFail {
  constructor(message: string) {
    this.message = message;
  }

  @Field()
  message: string;
}
