import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';

export abstract class AuthCheckContract {
  abstract isAuthorized(credentials: IUserCredentials, dataToCheck: any): Promise<boolean>;
}
