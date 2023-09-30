import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductCategoriesResolver } from './product-categories.resolver';
import { ProductCategoriesService } from './product-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoriesResolver, ProductCategoriesService],
})
export class ProductCategoriesModule {}
