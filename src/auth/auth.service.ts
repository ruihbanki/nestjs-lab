import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './auth.types';
import { FindOptionsRelations } from 'typeorm';
import { LoginDTO } from './login-result.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    clientId: string,
    username: string,
    password: string,
    relations?: FindOptionsRelations<LoginDTO>,
  ) {
    // get user
    const userRelations =
      typeof relations?.user === 'object' ? relations?.user : undefined;
    const user = await this.userService.findUserByUsername(
      clientId,
      username,
      userRelations,
    );
    if (!user) {
      throw new Error('Invalid user or password');
    }

    // validate password
    // TODO the password must be a hash
    const isValidPassword = user.password === password;
    if (!isValidPassword) {
      throw new Error('Invalid user or password');
    }

    // generate token
    const payload: AuthPayload = {
      clientId,
      userId: user.userId,
      userType: user.userType,
    };
    const token = await this.jwtService.signAsync(payload);
    return { user, token };
  }

  async generateClientToken(clientId: string) {
    const payload: AuthPayload = {
      clientId,
    };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
