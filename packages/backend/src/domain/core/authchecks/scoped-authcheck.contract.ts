import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthCheckContract } from './authcheck.contract';
export abstract class ScopedAuthCheckContract implements AuthCheckContract {
  abstract isAuthorized(credentials: IUserCredentials, dataToCheck: ScopedData): Promise<boolean>;
}

export class ScopedData {
  orgIdForTargetResource?: string;
  userIdForTargetResource?: string;
}
