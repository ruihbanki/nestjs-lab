import { UsersService } from 'src/modules/users/users.service';
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
      throw new Error('Invalid user or password');
    }

    // validate password
    const isValid = user.password === password;
    if (!isValid) {
      throw new Error('Invalid user or password');
    }

    // check client
    const hasValidClient = !!clientId
      ? user.clients?.some((c) => c.clientId === clientId)
      : true;
    if (!hasValidClient) {
      throw new Error('User not associated with this client');
    }

    // generate token
    const tokenKey = this.configService.get('AUTH_TOKEN_KEY');
    const token = jwt.sign({ userId: user.userId }, tokenKey);

    // return
    return { user, token };
  }
}
