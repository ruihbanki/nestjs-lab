import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OffsetPageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
