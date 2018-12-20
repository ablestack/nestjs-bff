import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationTest } from './authorization-test.abstract';
import { hasRole } from './authorization-test.utils';
import { IAuthorizationTestData } from './authorizationTestData.interface';

export class CheckRole extends AuthorizationTest {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(data: IAuthorizationTestData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticatedEntity found');

    return hasRole(data.requestingEntity, this.qualifyingRole);
  }
}
