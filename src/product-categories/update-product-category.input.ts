import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductCategoryInput } from './create-product-category.input';

@InputType()
export class UpdateProductCategoryInput extends PartialType(
  CreateProductCategoryInput,
) {}
