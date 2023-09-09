import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { SortDirection } from 'src/types/service.types';

@InputType()
export class ProductsFilter {
  @Field({ nullable: true })
  nameLike?: string;

  @Field({ nullable: true })
  priceGt?: number;

  @Field({ nullable: true })
  priceLt?: number;
}

@InputType()
export class ProductsSorting {
  @Field()
  field?: 'name' | 'price' | 'createdAt';

  @Field()
  direction?: SortDirection;
}

@InputType()
export class ProductsPaging {
  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  offset?: number;
}

@ArgsType()
export class ProductsArgs {
  @Field({ nullable: true })
  withDeleted?: boolean;

  @Field(() => ProductsFilter, { nullable: true })
  filter?: ProductsFilter;

  @Field(() => [ProductsSorting], { nullable: true })
  sorting?: ProductsSorting[];

  @Field(() => ProductsPaging, { nullable: true })
  paging?: ProductsPaging;
}
