import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductInput } from './create-product.input';
import { UpdateProductInput } from './update-product.input';
import { ProductsArgs } from './products.args';
import { AuthPayload } from '../auth/auth-payload.decorator';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product])
  async products(
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
    @AuthPayload('clientId') clientId: string,
    @Args() args: ProductsArgs = {},
  ) {
    return this.productsService.findProducts(clientId, {
      relations,
      select,
      ...args,
    });
  }

  @Query(() => Product)
  async product(
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
  ) {
    return this.productsService.findProductById(clientId, productId, {
      relations,
      select,
    });
  }

  @Mutation(() => Product)
  async createProduct(
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
    @AuthPayload('clientId') clientId: string,
    @Args('input') input: CreateProductInput,
  ) {
    const product = await this.productsService.createProduct(clientId, input);
    return this.productsService.findProductById(clientId, product.productId, {
      relations,
      select,
    });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductInput,
  ) {
    await this.productsService.updateProduct(clientId, productId, input);
    return this.productsService.findProductById(clientId, productId, {
      relations,
      select,
    });
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
