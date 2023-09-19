import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { ProductCategory } from './product-category.entity';
import { UpdateProductCategoryInput } from './update-product-category.input';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { ProductCategoriesArgs } from './product-categories.args';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async findProductCategories(
    clientId: string,
    options: ProductCategoriesArgs,
    relations?: FindOptionsRelations<ProductCategory>,
    select?: FindOptionsSelect<ProductCategory>,
  ): Promise<ProductCategory[]> {
    const { withDeleted } = options;
    return this.productCategoriesRepository.find({
      where: {
        client: { clientId },
      },
      relations,
      select,
      withDeleted,
    });
  }

  async findProductCategoryById(
    clientId: string,
    productCategoryId: string,
    relations?: FindOptionsRelations<ProductCategory>,
    select?: FindOptionsSelect<ProductCategory>,
  ): Promise<ProductCategory | null> {
    return this.productCategoriesRepository.findOne({
      where: {
        productCategoryId,
        client: { clientId },
      },
      relations,
      select,
    });
  }

  async createProductCategory(
    clientId: string,
    productDto: CreateProductCategoryDto,
    relations?: FindOptionsRelations<ProductCategory>,
    select?: FindOptionsSelect<ProductCategory>,
  ): Promise<ProductCategory> {
    const product = await this.productCategoriesRepository.save({
      ...productDto,
      client: {
        clientId,
      },
    });
    const result = this.findProductCategoryById(
      clientId,
      product.productCategoryId,
    );
    return this.findProductCategoryById(
      clientId,
      (await result).productCategoryId,
      relations,
      select,
    );
  }

  async updateProductCategory(
    clientId: string,
    productCategoryId: string,
    input: UpdateProductCategoryInput,
    relations?: FindOptionsRelations<ProductCategory>,
    select?: FindOptionsSelect<ProductCategory>,
  ): Promise<ProductCategory> {
    const result = await this.productCategoriesRepository.update(
      {
        productCategoryId,
        client: {
          clientId,
        },
      },
      input,
    );
    if (result.affected === 0) {
      throw new NotFoundException(
        `ProductCategory with the productCategoryId '${productCategoryId}' was not found.`,
      );
    }
    return this.findProductCategoryById(
      clientId,
      productCategoryId,
      relations,
      select,
    );
  }

  async deleteProductCategory(
    clientId: string,
    productCategoryId: string,
  ): Promise<boolean> {
    const result = await this.productCategoriesRepository.delete({
      productCategoryId,
      client: {
        clientId,
      },
    });
    return result.affected > 0;
  }

  async softDeleteProductCategory(
    clientId: string,
    productCategoryId: string,
  ): Promise<boolean> {
    const result = await this.productCategoriesRepository.softDelete({
      productCategoryId,
      client: {
        clientId,
      },
    });
    return result.affected > 0;
  }
}
