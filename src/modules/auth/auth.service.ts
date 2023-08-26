import { UsersService } from 'src/modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './auth.types';
import { FindOptionsRelations } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDTO } from './login-result.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
    clientId?: string,
    relations?: FindOptionsRelations<LoginDTO>,
  ) {
    // get user
    const userRelations =
      typeof relations?.user === 'object' ? relations?.user : undefined;
    const user = await this.userService.findUserByUsername(username, {
      relations: {
        ...userRelations,
        clients: !!clientId || userRelations?.clients,
      },
    });
    if (!user) {
      throw new Error('Invalid user or password');
    }

    // validate password
    // TODO the password must be a hash
    const isValidPassword = user.password === password;
    if (!isValidPassword) {
      throw new Error('Invalid user or password');
    }

    // check if user is associated with the client
    const hasValidClient = !!clientId
      ? user.clients?.some((c) => c.clientId === clientId)
      : true;
    if (!hasValidClient) {
      throw new Error('User is not associated with this client');
    }

    // generate token
    const payload: AuthPayload = {
      clientId,
      userId: user.userId,
    };
    const token = await this.jwtService.signAsync(payload);

    return { user, token };
  }
}
