import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { hasOrganization, isSystemAdmin } from './authorizationcheck.utils';
import { ScopedAuthorizationCheck, ScopedData } from './scoped-authorizationcheck.interface';

export class CheckOrgParam implements ScopedAuthorizationCheck {
  public async isAuthorized(credentials: IUserCredentials, scopedData: ScopedData): Promise<boolean> {
    if (!credentials) throw Error('No authentication credentials found');
    if (!scopedData.orgIdForTargetResource) throw Error('organizationSlugForRequestedResource can not be null');

    if (isSystemAdmin(credentials)) return true;
    return hasOrganization(credentials, scopedData.orgIdForTargetResource);
  }
}
