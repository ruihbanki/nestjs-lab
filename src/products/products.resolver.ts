import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { AuthClientDTO } from 'src/auth/auth-client.dto';
import { AuthClient } from 'src/auth/auth-client.decorator';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductInput } from './create-product.input';
import { UpdateProductInput } from './update-product.input';
import { ProductsArgs } from './products.args';
import { ProductsConnection } from './products-connection.dto';
import { BuyProductInput } from './buy-product.input';
import { BuyProductResult } from './buy-product-result';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => ProductsConnection)
  async products(
    @AuthClient() { clientId }: AuthClientDTO,
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
    @AuthClient() { clientId }: AuthClientDTO,
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
    @AuthClient() { clientId }: AuthClientDTO,
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
    @AuthClient() { clientId }: AuthClientDTO,
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
    @AuthClient() { clientId }: AuthClientDTO,
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

  @Mutation(() => BuyProductResult)
  async buyProduct(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('input') input: BuyProductInput,
  ) {
    return this.productsService.buyProduct(clientId, input);
  }
}
