import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationCheck } from './authorizationcheck.abstract';
import { hasRole } from './authorizationcheck.utils';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export class CheckRole extends AuthorizationCheck {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticatedEntity found');

    return hasRole(data.requestingEntity, this.qualifyingRole);
  }
}
