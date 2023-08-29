import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { ProductCategory } from './product-category.entity';
import { UpdateProductCategoryInput } from './update-product-category.input';
import { CreateProductCategoryDto } from './create-product-category.dto';

interface FindProductCategoriesOptions {
  withDeleted?: boolean;
  relations?: FindOptionsRelations<ProductCategory>;
  select?: FindOptionsSelect<ProductCategory>;
}

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async findProductCategories(
    clientId: string,
    options: FindProductCategoriesOptions = {},
  ): Promise<ProductCategory[]> {
    const { relations, select, withDeleted } = options;
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
    options: FindProductCategoriesOptions = {},
  ): Promise<ProductCategory | null> {
    const { relations, select, withDeleted } = options;
    return this.productCategoriesRepository.findOne({
      where: {
        productCategoryId,
        client: { clientId },
      },
      relations,
      select,
      withDeleted,
    });
  }

  async createProductCategory(
    clientId: string,
    productDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    const product = await this.productCategoriesRepository.save({
      ...productDto,
      client: {
        clientId,
      },
    });
    return this.findProductCategoryById(clientId, product.productCategoryId);
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

  async updateProductCategory(
    clientId: string,
    productCategoryId: string,
    input: UpdateProductCategoryInput,
  ): Promise<void> {
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
  }
}
