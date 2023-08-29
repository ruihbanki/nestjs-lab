import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductCategoryDto {
  name: string;
}
