import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthorizationCheck } from './authorizationcheck';
import { hasOrganizationRole, isSystemAdmin } from './authorizationcheck.utils';
import { ScopedData } from './scoped-authorizationcheck.interface';

export class CheckOrgRoles implements AuthorizationCheck {
  constructor(private readonly qualifyingRoles: string[]) {}

  public async isAuthorized(credentials: IUserCredentials, scopedData: ScopedData): Promise<boolean> {
    if (!credentials) throw Error('No authentication credentials found');
    if (!scopedData.orgIdForTargetResource) throw Error('orgIdForTargetResource can not be null');

    if (isSystemAdmin(credentials)) return true;
    return hasOrganizationRole(credentials, scopedData.orgIdForTargetResource, this.qualifyingRoles);
  }
}
