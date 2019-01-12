import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AuthorizationError } from '../../../shared/exceptions/authorization.exception';
import { AuthorizationTarget } from './authorization-target';

export abstract class AuthCheckContract<TTargetResource> {
  abstract isAuthorized(accessPermissions: AccessPermissionsContract | null | undefined, target?: AuthorizationTarget<TTargetResource>): Promise<boolean>;

  async ensureAuthorized(accessPermissions: AccessPermissionsContract | null | undefined, target?: AuthorizationTarget<TTargetResource>): Promise<void> {
    if (!(await this.isAuthorized(accessPermissions, target))) {
      throw new AuthorizationError(`Not Authorized`, { data: target, authorization: accessPermissions });
    }
  }
}
