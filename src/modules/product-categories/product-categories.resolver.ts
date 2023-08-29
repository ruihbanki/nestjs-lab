import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { Relations } from 'src/utils/relations.decorator';
import { Select } from 'src/utils/select.decorator';
import { AuthPayload } from '../auth/auth-payload.decorator';
import { ProductCategory } from './product-category.entity';
import { ProductCategoriesService } from './product-categories.service';
import { FindProductCategoriesArgs } from './find-product-categories.args';
import { CreateProductCategoryInput } from './create-product-category.input';
import { UpdateProductCategoryInput } from './update-product-category.input';

@Resolver(() => ProductCategory)
export class ProductCategoriesResolver {
  constructor(private productCategoriesService: ProductCategoriesService) {}

  @Query(() => [ProductCategory])
  async findProductCategories(
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
    @AuthPayload('clientId') clientId: string,
    @Args() args: FindProductCategoriesArgs = {},
  ) {
    const { withDeleted } = args;
    return this.productCategoriesService.findProductCategories(clientId, {
      withDeleted,
      relations,
      select,
    });
  }

  @Query(() => ProductCategory)
  async findProductCategoryById(
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
    @AuthPayload('clientId') clientId: string,
    @Args('productCategoryId') productCategoryId: string,
  ) {
    return this.productCategoriesService.findProductCategoryById(
      clientId,
      productCategoryId,
      {
        relations,
        select,
      },
    );
  }

  @Mutation(() => ProductCategory)
  async createProductCategory(
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
    @AuthPayload('clientId') clientId: string,
    @Args('input') input: CreateProductCategoryInput,
  ) {
    const productCategory =
      await this.productCategoriesService.createProductCategory(
        clientId,
        input,
      );
    return this.productCategoriesService.findProductCategoryById(
      clientId,
      productCategory.productCategoryId,
      {
        relations,
        select,
      },
    );
  }

  @Mutation(() => ProductCategory)
  async updateProductCategory(
    @Relations() relations: FindOptionsRelations<ProductCategory>,
    @Select() select: FindOptionsSelect<ProductCategory>,
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductCategoryInput,
  ) {
    await this.productCategoriesService.updateProductCategory(
      clientId,
      productId,
      input,
    );
    return this.productCategoriesService.findProductCategoryById(
      clientId,
      productId,
      {
        relations,
        select,
      },
    );
  }

  @Mutation(() => Boolean)
  async deleteProductCategory(
    @AuthPayload('clientId') clientId: string,
    @Args('productId') productId: string,
  ) {
    return this.productCategoriesService.deleteProductCategory(
      clientId,
      productId,
    );
  }

  @Mutation(() => Boolean)
  async softDeleteProductCategory(
    @AuthPayload('clientId') clientId: string,
    @Args('id') id: string,
  ) {
    return this.productCategoriesService.softDeleteProductCategory(
      clientId,
      id,
    );
  }
}
