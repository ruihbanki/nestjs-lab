import { UserType } from 'src/users/user-type.enum';

export interface AuthPayload {
  clientId?: string;
  userId?: string;
  userType?: UserType;
}

export type AuthPayloadKey = keyof AuthPayload;
