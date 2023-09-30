import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ProductsSortingField } from './products-sorting-field.enum';
import { SortDirection } from 'src/utils/sort-direction.enum';
import { OffsetPagingInput } from 'src/utils/offset-paging.input';

@InputType()
export class ProductsFilterInput {
  @Field({ nullable: true })
  nameLike?: string;

  @Field({ nullable: true })
  priceGt?: number;

  @Field({ nullable: true })
  priceLt?: number;

  @Field(() => [String], { nullable: true })
  categoriesIn?: string[];
}

@InputType()
export class ProductsSortingInput {
  @Field(() => ProductsSortingField)
  field?: ProductsSortingField;

  @Field(() => SortDirection)
  direction?: SortDirection;
}

@ArgsType()
export class ProductsArgs {
  @Field(() => ProductsFilterInput, { nullable: true })
  filter?: ProductsFilterInput;

  @Field(() => [ProductsSortingInput], { nullable: true })
  sorting?: ProductsSortingInput[];

  @Field(() => OffsetPagingInput, { nullable: true })
  paging?: OffsetPagingInput;

  @Field({ nullable: true })
  withDeleted?: boolean;
}
