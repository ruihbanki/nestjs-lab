import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@ObjectType()
export class LoginDTO {
  @Field()
  user: User;

  @Field()
  token: string;
}
