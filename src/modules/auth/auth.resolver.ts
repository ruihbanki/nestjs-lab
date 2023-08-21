import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ErrorDTO, LoginDTO, LoginResultDTO } from './login-result.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => LoginResultDTO)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('clientId', { nullable: true }) clientId?: string,
  ) {
    try {
      const result = await this.authService.login(username, password, clientId);
      return new LoginDTO(result.user, result.token);
    } catch (error) {
      return new ErrorDTO(error.message);
    }
  }
}
