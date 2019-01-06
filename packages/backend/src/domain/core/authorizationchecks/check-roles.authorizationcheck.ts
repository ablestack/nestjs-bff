import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthorizationCheck } from './authorizationcheck';
import { hasRole } from './authorizationcheck.utils';

export class CheckRole extends AuthorizationCheck {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(credentials: IUserCredentials, dataToCheck: any): Promise<boolean> {
    if (!credentials) throw Error('No authentication credentials found');

    return hasRole(credentials, this.qualifyingRole);
  }
}
