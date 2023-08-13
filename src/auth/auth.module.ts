import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthResolver],
})
export class AuthModule {}
