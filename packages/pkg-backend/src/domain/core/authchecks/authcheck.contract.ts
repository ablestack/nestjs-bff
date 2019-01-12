import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AuthorizationError } from '../../../shared/exceptions/authorization.exception';

export abstract class AuthCheckContract<TData> {
  abstract isAuthorized(accessPermissions: AccessPermissionsContract | null | undefined, dataToCheck?: TData): Promise<boolean>;

  async ensureAuthorized(accessPermissions: AccessPermissionsContract | null | undefined, dataToCheck?: TData): Promise<void> {
    if (!(await this.isAuthorized(accessPermissions, dataToCheck))) {
      throw new AuthorizationError(`Not Authorized`, { data: dataToCheck, authorization: accessPermissions });
    }
  }
}
