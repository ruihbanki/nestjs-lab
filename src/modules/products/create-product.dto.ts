import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  name: string;

  price: number;

  available: number;
}
