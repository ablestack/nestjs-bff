import { AuthorizationScopeContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { ScopedData } from './scoped-data';

export class CheckOrgRoles extends AuthCheckContract<ScopedData> {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(authorizationScope: AuthorizationScopeContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!authorizationScope) throw new AppError('No authentication authorizationScope found');
    if (!scopedData.orgIdForTargetResource) throw new AppError('orgIdForTargetResource can not be null');

    if (isStaffAdmin(authorizationScope)) return true;
    return hasOrganizationRole(authorizationScope, scopedData.orgIdForTargetResource, this.qualifyingRoles);
  }
}
