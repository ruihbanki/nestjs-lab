import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CursorPagingInput {
  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  after?: string;
}
