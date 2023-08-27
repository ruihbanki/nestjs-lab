import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '../config/config.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequestFromContext(context);
    const token = this.getTokenFromHeader(request);
    if (token) {
      const payload = await this.getPayloadFromToken(token);
      request['auth_payload'] = payload;
    }
    return true;
  }

  private getRequestFromContext(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req as Request;
  }

  private getTokenFromHeader(request: Request) {
    const [type, value] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? value : undefined;
  }

  private async getPayloadFromToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
