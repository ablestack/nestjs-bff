import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { ScopedData } from './scoped-data';

export class CheckOrgRoles extends AuthCheckContract<ScopedData> {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!credentials) throw new AppError('No authentication credentials found');
    if (!scopedData.orgIdForTargetResource) throw new AppError('orgIdForTargetResource can not be null');

    if (isStaffAdmin(credentials)) return true;
    return hasOrganizationRole(credentials, scopedData.orgIdForTargetResource, this.qualifyingRoles);
  }
}
