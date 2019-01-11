import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
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

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, dataToCheck: any): Promise<boolean> {
    if (!credentials) throw new AppError('No authentication credentials found');

    return hasRole(credentials, this.qualifyingRole);
  }
}
