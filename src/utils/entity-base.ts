import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export abstract class EntityBase {
  @Field()
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt?: Date;
}
