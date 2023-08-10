import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityBase } from 'src/utils/entity-base';

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
  @Column({ type: 'float' })
  price: number;

  @Field()
  @Column({ type: 'int' })
  available: number;
}
