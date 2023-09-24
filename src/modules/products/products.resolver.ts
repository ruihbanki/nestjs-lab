import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { ConnectionSelect } from 'src/utils/connection-select.decorator';
import { ConnectionRelations } from 'src/utils/connection-relations.decorator';
import { AuthPayload } from '../auth/auth-payload.decorator';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductInput } from './create-product.input';
import { UpdateProductInput } from './update-product.input';
import { ProductsArgs } from './products.args';
import { ProductsConnection } from './products-connection.object';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => ProductsConnection)
  async products(
    @AuthPayload('clientId') clientId: string,
    @Args() args: ProductsArgs = {},
    @ConnectionRelations() relations: FindOptionsRelations<Product>,
    @ConnectionSelect() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.findProducts(clientId, args, relations, select);
  }

  @Query(() => Product)
  async product(
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.findProductById(
      clientId,
      productId,
      relations,
      select,
    );
  }

  @Mutation(() => Product)
  async createProduct(
    @AuthPayload('clientId') clientId: string,
    @Args('input') input: CreateProductInput,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.createProduct(
      clientId,
      input,
      relations,
      select,
    );
  }

  @Mutation(() => Product)
  async updateProduct(
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductInput,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    await this.productsService.updateProduct(
      clientId,
      productId,
      input,
      relations,
      select,
    );
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
  ) {
    return this.productsService.deleteProduct(clientId, productId);
  }

  @Mutation(() => Boolean)
  async softDeleteProduct(
    @AuthPayload('clientId') clientId: string,
    @Args('id') id: string,
  ) {
    return this.productsService.softDeleteProduct(clientId, id);
  }
}
