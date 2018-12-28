import { IsMongoId } from 'class-validator';

export class AuthenticationDomainEntity {
  @IsMongoId()
  public userId: string = '';

  local?: {
    email: string;
    hashedPassword: string;
  };

  google?: {
    id: string;
    email: string;
    name: string;
  };

  facebook?: {
    id: string;
    name: string;
    email: string;
  };

  twitter?: {
    id: string;
    displayName: string;
    username: string;
  };
}
