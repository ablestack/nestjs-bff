import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { hasOrganization, isStaffAdmin } from './authcheck.utils';
import { ScopedAuthCheckContract, ScopedData } from './scoped-authcheck.contract';

export class OrgAuthCheck implements ScopedAuthCheckContract {
  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!scopedData.orgIdForTargetResource) throw new AppError('organizationSlugForRequestedResource can not be null');

    if (!credentials) return false;
    if (isStaffAdmin(credentials)) return true;
    return hasOrganization(credentials, scopedData.orgIdForTargetResource);
  }
}
