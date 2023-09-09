import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  Raw,
  Repository,
} from 'typeorm';

import { Product } from './product.entity';
import { UpdateProductInput } from './update-product.input';
import { FindProductsOptions } from './find-products-options.dto';
import { FindProductOptions } from './find-product-options.dto';
import { ProductsFilterInput, ProductsSortingInput } from './products.args';
import { CreateProductInput } from './create-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private ProductsRepository: Repository<Product>,
  ) {}

  async findProducts(
    clientId: string,
    options: FindProductsOptions = {},
  ): Promise<Product[]> {
    const { relations, select, withDeleted, filter, sorting, paging } = options;
    const where = this.findProductsWhere(clientId, filter);
    const order = this.findProductsOrder(sorting);
    return this.ProductsRepository.find({
      where,
      withDeleted,
      order,
      relations,
      select,
      skip: paging?.offset,
      take: paging?.limit,
    });
  }

  private findProductsWhere(
    clientId: string,
    filter: ProductsFilterInput,
  ): FindOptionsWhere<Product> {
    const nameLikeLower = filter?.nameLike?.toLocaleLowerCase();
    const name = nameLikeLower
      ? Raw((alias) => `LOWER(${alias}) Like '%${nameLikeLower}%'`)
      : undefined;
    let price = undefined;
    if (filter?.priceGt !== undefined && filter?.priceLt !== undefined) {
      price = Between(filter.priceGt, filter.priceLt);
    } else if (filter?.priceGt !== undefined) {
      price = MoreThan(filter?.priceGt);
    } else if (filter?.priceLt !== undefined) {
      price = LessThan(filter.priceLt);
    }
    const categories = filter.categoriesIn
      ? {
          productCategoryId: In(filter.categoriesIn),
        }
      : undefined;
    return {
      client: { clientId },
      name,
      price,
      categories,
    };
  }

  private findProductsOrder(
    sorting: ProductsSortingInput[],
  ): FindOptionsOrder<Product> {
    const initial: FindOptionsOrder<Product> = {};
    return sorting?.reduce(
      (prev, cur) => ({
        ...prev,
        [cur.field]: cur.direction,
      }),
      initial,
    );
  }

  async findProductById(
    clientId: string,
    productId: string,
    options: FindProductOptions = {},
  ): Promise<Product | null> {
    const { relations, select } = options;
    return this.ProductsRepository.findOne({
      where: {
        productId,
        client: { clientId },
      },
      relations,
      select,
    });
  }

  async createProduct(
    clientId: string,
    product: CreateProductInput,
    options: FindProductOptions = {},
  ): Promise<Product> {
    const result = await this.ProductsRepository.save({
      ...product,
      client: {
        clientId,
      },
    });
    return this.findProductById(clientId, result.productId, options);
  }

  async updateProduct(
    clientId: string,
    productId: string,
    input: UpdateProductInput,
    options: FindProductOptions = {},
  ): Promise<Product> {
    const result = await this.ProductsRepository.update(
      {
        productId,
        client: {
          clientId,
        },
      },
      input,
    );
    if (result.affected === 0) {
      throw new NotFoundException(
        `Product with the productId '${productId}' was not found.`,
      );
    }
    return this.findProductById(clientId, productId, options);
  }

  async deleteProduct(clientId: string, productId: string): Promise<boolean> {
    const result = await this.ProductsRepository.delete({
      productId,
      client: {
        clientId,
      },
    });
    return result.affected > 0;
  }

  async softDeleteProduct(
    clientId: string,
    productId: string,
  ): Promise<boolean> {
    const result = await this.ProductsRepository.softDelete({
      productId,
      client: {
        clientId,
      },
    });
    return result.affected > 0;
  }
}
