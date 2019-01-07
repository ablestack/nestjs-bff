import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';

export abstract class AuthCheckContract {
  abstract isAuthorized(credentials: UserCredentialsContract, dataToCheck?: any): Promise<boolean>;
}
