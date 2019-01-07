import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AuthCheckContract } from './authcheck.contract';
export abstract class ScopedAuthCheckContract implements AuthCheckContract {
  abstract isAuthorized(credentials: UserCredentialsContract | undefined | null, dataToCheck: ScopedData): Promise<boolean>;
}

export class ScopedData {
  orgIdForTargetResource?: string;
  userIdForTargetResource?: string;
}
