import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthUserDTO } from './auth-user.dto';

export const AuthUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const payload = request.auth_payload;
    const { clientId, userId, userType } = payload;
    if (!clientId || !userId || !userType) {
      throw new UnauthorizedException('UserToken is required');
    }
    return new AuthUserDTO(clientId, userId, userType);
  },
);
