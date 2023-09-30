import { registerEnumType } from '@nestjs/graphql';

export enum UserType {
  MEMBER = 'member',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

registerEnumType(UserType, {
  name: 'UserType',
});
