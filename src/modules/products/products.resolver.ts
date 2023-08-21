import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';

import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductInput } from './create-product.input';
import { UpdateProductInput } from './update-product.input';
import { FindProductsArgs } from './find-products.args';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => Product)
  async findProductById(@Args('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @Query(() => [Product])
  async findProducts(
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
    @Args() args?: FindProductsArgs,
  ) {
    const { withDeleted } = args;
    return this.productsService.findProducts({
      withDeleted,
      relations,
      select,
    });
  }

  @Mutation(() => Product)
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productsService.createProduct(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ) {
    await this.productsService.updateProduct(id, input);
    return this.productsService.findProductById(id);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('productId') productId: string) {
    return this.productsService.deleteProduct(productId);
  }

  @Mutation(() => Boolean)
  async softDeleteProduct(@Args('id') id: string) {
    return this.productsService.softDeleteProduct(id);
  }
}
