import { Args, Query } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './login.dto';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IAppConfigService } from 'src/app-config.module';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<IAppConfigService>,
    private userService: UsersService,
  ) {}

  @Query(() => LoginDTO)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user = await this.userService.findUserByUsername(username);
    const isValid = user.password === password;

    const tokenKey = this.configService.get('AUTH_TOKEN_KEY');
    const token = jwt.sign({ userId: user.userId }, tokenKey);
    console.log(isValid);

    return { user, token };
  }
}
