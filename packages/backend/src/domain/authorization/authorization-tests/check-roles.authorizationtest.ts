import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';
import { hasRole } from './authorization-test.utils';

export class CheckRole extends AuthorizationTest {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean> {
    if (!requestingEntity) throw Error('No authenticatedEntity found');

    return hasRole(requestingEntity, this.qualifyingRole);
  }
}
