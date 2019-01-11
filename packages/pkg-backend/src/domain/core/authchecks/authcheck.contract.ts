import { AuthorizationScopeContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { AuthorizationError } from '../../../shared/exceptions/authorization.exception';

export abstract class AuthCheckContract<TData> {
  abstract isAuthorized(authorizationScope: AuthorizationScopeContract | null | undefined, dataToCheck?: TData): Promise<boolean>;

  async ensureAuthorized(authorizationScope: AuthorizationScopeContract | null | undefined, dataToCheck?: TData): Promise<void> {
    if (!(await this.isAuthorized(authorizationScope, dataToCheck))) {
      throw new AuthorizationError(`Not Authorized`, { data: dataToCheck, authorization: authorizationScope });
    }
  }
}
