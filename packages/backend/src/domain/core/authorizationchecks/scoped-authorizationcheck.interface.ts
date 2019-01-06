import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthorizationCheck } from './authorizationcheck';
export abstract class ScopedAuthorizationCheck implements AuthorizationCheck {
  abstract isAuthorized(credentials: IUserCredentials, dataToCheck: ScopedData): Promise<boolean>;
}

export class ScopedData {
  orgIdForTargetResource?: string;
  userIdForTargetResource?: string;
}
