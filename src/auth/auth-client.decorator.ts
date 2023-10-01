import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthClientDTO } from './auth-client.dto';

export const AuthClient = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const payload = request.auth_payload;
    const { clientId } = payload;
    if (!clientId) {
      throw new UnauthorizedException('ClientToken is required');
    }
    return new AuthClientDTO(clientId);
  },
);
