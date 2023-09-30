import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CursorPageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field()
  startCursor: string;

  @Field()
  endCursor: string;
}
