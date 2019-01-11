import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationScopeContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasRole } from './authcheck.utils';

export class RoleAuthCheck extends AuthCheckContract<any> {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(authorizationScope: AuthorizationScopeContract | undefined | null, dataToCheck: any): Promise<boolean> {
    if (!authorizationScope) throw new AppError('No authentication authorizationScope found');

    return hasRole(authorizationScope, this.qualifyingRole);
  }
}
