import { AuthorizationEntity } from '@nestjs-bff/global/lib/lib/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';
import { isSystemAdmin } from './authorization-test.utils';

export class CheckOrganizationRoles extends AuthorizationTest {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean> {
    if (!requestingEntity) throw Error('No authenticated User found');
    if (!organizationIdForRequestedResource)
      throw Error('organizationIdForRequestedResource can not be null');

    return this.hasOrganizationRole(
      requestingEntity,
      organizationIdForRequestedResource,
      this.qualifyingRoles,
    );
  }

  private hasOrganizationRole(
    authorization: AuthorizationEntity,
    organizationIDForResource: string,
    qualifyingRoles: string[],
  ): boolean {
    if (isSystemAdmin(authorization)) return true;
    return !!authorization.organizations.find(organizationAuth => {
      return (
        // tslint:disable-next-line:triple-equals
        organizationAuth.organizationId == organizationIDForResource &&
        qualifyingRoles.some(role =>
          organizationAuth.organizationRoles.includes(role),
        )
      );
    });
  }
}
