import { registerEnumType } from '@nestjs/graphql';

export enum ProductsSortingField {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
}

registerEnumType(ProductsSortingField, {
  name: 'ProductsSortingField',
});
