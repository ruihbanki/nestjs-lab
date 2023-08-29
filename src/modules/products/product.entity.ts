import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityBase } from 'src/utils/entity-base';
import { Client } from '../clients/client.entity';
import { ProductCategory } from '../product-categories/product-category.entity';

@Entity()
@ObjectType()
export class Product extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
  productId: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Field()
  @Column({ type: 'int' })
  available: number;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Field(() => [ProductCategory], { nullable: true })
  @ManyToMany(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { nullable: true },
  )
  @JoinTable({
    name: 'product_product_category',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'productId',
    },
    inverseJoinColumn: {
      name: 'product_category_id',
      referencedColumnName: 'productCategoryId',
    },
  })
  categories?: ProductCategory[];
}
