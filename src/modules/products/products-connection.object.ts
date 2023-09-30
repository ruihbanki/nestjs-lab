import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';
import { OffsetPageInfo } from 'src/utils/offset-page-info.object';

@ObjectType()
export class ProductsConnection {
  @Field()
  totalCount: number;

  @Field(() => [Product])
  nodes: Product[];

  @Field(() => OffsetPageInfo)
  pageInfo: OffsetPageInfo;
}
