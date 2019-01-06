import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';

export abstract class AuthorizationCheck {
  abstract isAuthorized(credentials: IUserCredentials, dataToCheck: any): Promise<boolean>;
}
