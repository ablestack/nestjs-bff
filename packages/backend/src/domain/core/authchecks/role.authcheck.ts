import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AuthCheckContract } from './authcheck.contract';
import { hasRole } from './authcheck.utils';

export class RoleAuthCheck extends AuthCheckContract {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, dataToCheck: any): Promise<boolean> {
    if (!credentials) throw Error('No authentication credentials found');

    return hasRole(credentials, this.qualifyingRole);
  }
}
