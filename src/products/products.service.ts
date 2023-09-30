import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  Raw,
  Repository,
} from 'typeorm';

import { Product } from './product.entity';
import { UpdateProductInput } from './update-product.input';
import {
  ProductsArgs,
  ProductsFilterInput,
  ProductsSortingInput,
} from './products.args';
import { CreateProductInput } from './create-product.input';
import { ProductsConnection } from './products-connection.object';
import { OffsetPageInfo } from 'src/utils/offset-page-info.object';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findProducts(
    clientId: string,
    options: ProductsArgs = {},
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<ProductsConnection> {
    const { withDeleted, filter, sorting, paging } = options;
    const where = this.findProductsWhere(clientId, filter);
    const order = this.findProductsOrder(sorting);
    const [nodesPlusOne, totalCount] =
      await this.productsRepository.findAndCount({
        where,
        order,
        take: paging?.limit + 1,
        skip: paging?.offset,
        relations,
        select,
        withDeleted,
      });
    const nodes = nodesPlusOne.slice(0, paging?.limit);
    const pageInfo: OffsetPageInfo = {
      hasPreviousPage: paging?.offset > 0,
      hasNextPage: nodesPlusOne.length > nodes.length,
    };
    return {
      totalCount,
      nodes,
      pageInfo,
    };
  }

  private findProductsWhere(
    clientId: string,
    filter: ProductsFilterInput,
  ): FindOptionsWhere<Product> {
    // name
    const nameLikeLower = filter?.nameLike?.toLocaleLowerCase();
    const name = nameLikeLower
      ? Raw((alias) => `LOWER(${alias}) Like '%${nameLikeLower}%'`)
      : undefined;

    // price
    let price = undefined;
    if (filter?.priceGt !== undefined && filter?.priceLt !== undefined) {
      price = Between(filter.priceGt, filter.priceLt);
    } else if (filter?.priceGt !== undefined) {
      price = MoreThan(filter?.priceGt);
    } else if (filter?.priceLt !== undefined) {
      price = LessThan(filter.priceLt);
    }

    //categories
    const categories = filter?.categoriesIn
      ? {
          productCategoryId: In(filter?.categoriesIn),
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
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    const result = await this.productsRepository.findOne({
      where: {
        productId,
        client: { clientId },
      },
      relations,
      select,
    });
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async createProduct(
    clientId: string,
    product: CreateProductInput,
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    const result = await this.productsRepository.save({
      ...product,
      client: {
        clientId,
      },
    });
    return this.findProductById(clientId, result.productId, relations, select);
  }

  async updateProduct(
    clientId: string,
    productId: string,
    input: UpdateProductInput,
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    await this.productsRepository.update(
      {
        productId,
        client: {
          clientId,
        },
      },
      input,
    );
    return await this.findProductById(clientId, productId, relations, select);
  }

  async deleteProduct(
    clientId: string,
    productId: string,
    relations?: FindOptionsRelations<Product>,
    select?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    const product = await this.findProductById(
      clientId,
      productId,
      relations,
      select,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepository.softDelete({
      productId,
      client: {
        clientId,
      },
    });
    return product;
  }
}
