import { UsersService } from 'src/users/users.service';
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

  async login(username: string, password: string, clientId?: string) {
    // get user
    const user = await this.userService.findUserByUsername(username, {
      relations: { clients: !!clientId },
    });
    if (!user) {
      return null;
    }

    // validate password
    const isValid = user.password === password;
    if (!isValid) {
      return null;
    }

    // check client
    const hasValidClient = !!clientId
      ? user.clients?.some((c) => c.clientId === clientId)
      : true;
    if (!hasValidClient) {
      return null;
    }

    // generate token
    const tokenKey = this.configService.get('AUTH_TOKEN_KEY');
    const token = jwt.sign({ userId: user.userId }, tokenKey);

    // return
    return { user, token };
  }
}
