import { Args, Query, Resolver } from '@nestjs/graphql';
import { LoginDTO } from './login.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => LoginDTO)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('clientId', { nullable: true }) clientId?: string,
  ) {
    return await this.authService.login(username, password, clientId);
  }
}
