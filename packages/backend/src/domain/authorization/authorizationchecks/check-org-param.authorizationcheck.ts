import { AuthorizationCheck } from './authorizationcheck.abstract';
import { hasOrganization, isSystemAdmin } from './authorizationcheck.utils';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export class CheckOrgParam extends AuthorizationCheck {
  constructor() {
    super();
  }

  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticated User found');
    if (!data.orgIdForTargetResource) throw Error('organizationSlugForRequestedResource can not be null');

    if (isSystemAdmin(data.requestingEntity)) return true;
    return hasOrganization(data.requestingEntity, data.orgIdForTargetResource);
  }
}
