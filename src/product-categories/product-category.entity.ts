import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityBase } from 'src/utils/entity-base';
import { Client } from '../clients/client.entity';
import { Product } from '../products/product.entity';

@Entity()
@ObjectType()
export class ProductCategory extends EntityBase {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'product_category_id' })
  productCategoryId: string;

  @Field()
  @Column()
  name: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.categories, {
    nullable: true,
  })
  products: Product[];
}
