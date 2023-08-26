import { Args, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations } from 'typeorm';

import { AuthService } from './auth.service';
import { Relations } from 'src/utils/relations.decorator';
import { LoginDTO } from './login-result.dto';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => LoginDTO)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('clientId', { nullable: true }) clientId?: string,
    @Relations() relations?: FindOptionsRelations<LoginDTO>,
  ) {
    try {
      return await this.authService.login(
        username,
        password,
        clientId,
        relations,
      );
    } catch (error) {
      return new UnauthorizedException(error);
    }
  }
}
