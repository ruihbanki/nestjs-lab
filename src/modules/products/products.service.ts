import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductInput } from './create-product.input';
import { UpdateProductInput } from './update-product.input';

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

  findProducts(options: FindProductsOptions = {}): Promise<Product[]> {
    const { relations, select, withDeleted } = options;
    return this.ProductsRepository.find({
      relations,
      select,
      withDeleted,
    });
  }

  findProductById(productId: string): Promise<Product | null> {
    return this.ProductsRepository.findOneBy({ productId });
  }

  async createProduct(product: CreateProductInput): Promise<Product> {
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