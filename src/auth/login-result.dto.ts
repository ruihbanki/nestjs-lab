import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

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

@ObjectType()
export class ErrorDTO {
  constructor(message: string) {
    this.message = message;
  }

  @Field()
  message: string;
}

export const LoginResultDTO = createUnionType({
  name: 'LoginResultDTO',
  types: () => [LoginDTO, ErrorDTO] as const,
});
