import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { hasOrganization, isSystemAdmin } from './authcheck.utils';
import { ScopedAuthCheckContract, ScopedData } from './scoped-authcheck.contract';

export class OrgAuthCheck implements ScopedAuthCheckContract {
  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!credentials) throw Error('No authentication credentials found');
    if (!scopedData.orgIdForTargetResource) throw Error('organizationSlugForRequestedResource can not be null');

    if (isSystemAdmin(credentials)) return true;
    return hasOrganization(credentials, scopedData.orgIdForTargetResource);
  }
}
