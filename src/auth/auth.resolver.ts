import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOptionsRelations } from 'typeorm';

import { AuthService } from './auth.service';
import { Relations } from 'src/utils/relations.decorator';
import { LoginDTO } from './login-result.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ClientTokenDTO } from './client-token.dto copy';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => LoginDTO)
  async login(
    @Args('clientId') clientId: string,
    @Args('username') username: string,
    @Args('password') password: string,
    @Relations() relations?: FindOptionsRelations<LoginDTO>,
  ) {
    try {
      return await this.authService.login(
        clientId,
        username,
        password,
        relations,
      );
    } catch (error) {
      return new UnauthorizedException(error);
    }
  }

  @Mutation(() => ClientTokenDTO)
  generateClientToken(@Args('clientId') clientId: string) {
    return this.authService.generateClientToken(clientId);
  }
}
