import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
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
    @Relations() relations: FindOptionsRelations<ProductsConnection>,
    @Select() select: FindOptionsSelect<ProductsConnection>,
  ) {
    return this.productsService.findProducts(
      clientId,
      args,
      typeof relations.nodes === 'object' ? relations.nodes : undefined,
      typeof select.nodes === 'object' ? select.nodes : undefined,
    );
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
    return this.productsService.updateProduct(
      clientId,
      productId,
      input,
      relations,
      select,
    );
  }

  @Mutation(() => Product)
  async deleteProduct(
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
    @Relations() relations: FindOptionsRelations<Product>,
    @Select() select: FindOptionsSelect<Product>,
  ) {
    return this.productsService.deleteProduct(
      clientId,
      productId,
      relations,
      select,
    );
  }
}
