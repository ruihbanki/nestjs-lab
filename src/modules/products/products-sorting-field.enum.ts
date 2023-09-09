import { registerEnumType } from '@nestjs/graphql';

export enum ProductsSortingField {
  NAME = 'name',
  PRICE = 'price',
}

registerEnumType(ProductsSortingField, {
  name: 'ProductsSortingField',
});
