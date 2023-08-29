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

  findProducts(
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

  findProductById(
    clientId: string,
    productId: string,
  ): Promise<Product | null> {
    return this.ProductsRepository.findOneBy({
      productId,
      client: { clientId },
    });
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    return await this.ProductsRepository.save(product);
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const result = await this.ProductsRepository.delete(productId);
    return result.affected > 0;
  }

  async softDeleteProduct(productId: string): Promise<boolean> {
    const result = await this.ProductsRepository.softDelete(productId);
    return result.affected > 0;
  }

  async updateProduct(
    productId: string,
    input: UpdateProductInput,
  ): Promise<void> {
    const result = await this.ProductsRepository.update(productId, input);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Product with the productId '${productId}' was not found.`,
      );
    }
  }
}
