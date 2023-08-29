import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { Product } from './product.entity';
import { UpdateProductInput } from './update-product.input';
import { CreateProductDto } from './create-product.dto';

interface FindProductsOptions {
  withDeleted?: boolean;
  relations?: FindOptionsRelations<Product>;
  select?: FindOptionsSelect<Product>;
}

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
    const { relations, select, withDeleted } = options;
    return this.ProductsRepository.find({
      where: {
        client: { clientId },
      },
      relations,
      select,
      withDeleted,
    });
  }

  async findProductById(
    clientId: string,
    productId: string,
    options: FindProductsOptions = {},
  ): Promise<Product | null> {
    const { relations, select, withDeleted } = options;
    return this.ProductsRepository.findOne({
      where: {
        productId,
        client: { clientId },
      },
      relations,
      select,
      withDeleted,
    });
  }

  async createProduct(
    clientId: string,
    productDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.ProductsRepository.save({
      ...productDto,
      client: {
        clientId,
      },
    });
    return this.findProductById(clientId, product.productId);
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

  async updateProduct(
    clientId: string,
    productId: string,
    input: UpdateProductInput,
  ): Promise<void> {
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
  }
}
