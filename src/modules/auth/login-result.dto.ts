import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/user.entity';

@ObjectType()
export class LoginDTO {
  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }

  @Field()
  user: User;

  @Field()
  token: string;
}
