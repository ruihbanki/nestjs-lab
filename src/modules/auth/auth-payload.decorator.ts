import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadKey } from './auth.types';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthPayload = createParamDecorator(
  (key: AuthPayloadKey, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const payload = request.auth_payload;
    const value = payload?.[key];
    if (!value) {
      throw new UnauthorizedException(`Invalid token. Missing ${key}`);
    }
    return value;
  },
);
