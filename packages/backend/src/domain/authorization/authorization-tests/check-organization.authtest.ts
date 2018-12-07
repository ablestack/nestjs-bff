import { AuthorizationEntity } from '@nestjs-bff/global/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';
import { isSystemAdmin } from './authorization-test.utils';

export class CheckOrganization extends AuthorizationTest {
  constructor() {
    super();
  }

  public async isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean> {
    if (!requestingEntity) throw Error('No authenticated User found');
    if (!organizationIdForRequestedResource)
      throw Error('organizationSlugForRequestedResource can not be null');

    return this.hasOrganization(
      requestingEntity,
      organizationIdForRequestedResource,
    );
  }

  private hasOrganization(
    authorization: AuthorizationEntity,
    organizationIDForResource: string,
  ): boolean {
    if (isSystemAdmin(authorization)) return true;
    return !!authorization.organizations.find(organizationAuth => {
      return organizationAuth.organizationId === organizationIDForResource;
    });
  }
}
