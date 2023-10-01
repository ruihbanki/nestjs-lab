import { UserType } from 'src/users/user-type.enum';
import { AuthClientDTO } from './auth-client.dto';

export class AuthUserDTO extends AuthClientDTO {
  userId: string;
  userType: UserType;

  constructor(clientId: string, userId: string, userType: UserType) {
    super(clientId);
    this.userId = userId;
    this.userType = userType;
  }
}
