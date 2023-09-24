import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';
import { PageInfo } from 'src/utils/page-info.object';

@ObjectType()
export class ProductEdge {
  @Field(() => Product)
  node: Product;

  @Field()
  cursor: string;
}

@ObjectType()
export class ProductsConnection {
  @Field()
  totalCount: number;

  @Field(() => [ProductEdge])
  edges: ProductEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
