import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { ProductCategory } from './product-category.entity';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesArgs } from './product-categories.args';
import { CreateProductCategoryInput } from './create-product-category.input';
import { UpdateProductCategoryInput } from './update-product-category.input';
import { AuthClient } from 'src/auth/auth-client.decorator';
import { AuthClientDTO } from 'src/auth/auth-client.dto';

@Resolver(() => ProductCategory)
export class ProductCategoriesResolver {
  constructor(private productCategoriesService: ProductCategoriesService) {}

  @Query(() => [ProductCategory])
  async productCategories(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args() args: ProductCategoriesArgs = {},
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
  ) {
    return this.productCategoriesService.findProductCategories(
      clientId,
      args,
      relations,
      select,
    );
  }

  @Query(() => ProductCategory)
  async productCategory(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('productCategoryId') productCategoryId: string,
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
  ) {
    return this.productCategoriesService.findProductCategoryById(
      clientId,
      productCategoryId,
      relations,
      select,
    );
  }

  @Mutation(() => ProductCategory)
  async createProductCategory(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('input') input: CreateProductCategoryInput,
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
  ) {
    return this.productCategoriesService.createProductCategory(
      clientId,
      input,
      relations,
      select,
    );
  }

  @Mutation(() => ProductCategory)
  async updateProductCategory(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductCategoryInput,
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
  ) {
    return this.productCategoriesService.updateProductCategory(
      clientId,
      productId,
      input,
      relations,
      select,
    );
  }

  @Mutation(() => Boolean)
  async deleteProductCategory(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('productId') productId: string,
  ) {
    return this.productCategoriesService.deleteProductCategory(
      clientId,
      productId,
    );
  }

  @Mutation(() => Boolean)
  async softDeleteProductCategory(
    @AuthClient() { clientId }: AuthClientDTO,
    @Args('id') id: string,
  ) {
    return this.productCategoriesService.softDeleteProductCategory(
      clientId,
      id,
    );
  }
}
