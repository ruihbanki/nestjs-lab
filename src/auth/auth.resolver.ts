import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './login.dto';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthResolver {
  constructor(private userService: UsersService) {}

  @Query(() => LoginDTO)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user = await this.userService.findUserByUsername(username);
    const isValid = user.password === password;

    const token = jwt.sign({ userId: user.userId }, 'shhhhh');
    console.log(isValid);

    return { user, token };
  }
}
