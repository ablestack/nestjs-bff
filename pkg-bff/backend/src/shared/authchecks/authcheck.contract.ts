import { AuthorizationCheckError } from '../exceptions/authorization-check.exception';
import { AuthorizationCheckParams } from './authorization-params';

export abstract class AuthCheckContract<TTargetResource, TOperations> {
  abstract isAuthorized(params: AuthorizationCheckParams<TTargetResource, TOperations>): Promise<boolean>;

  async ensureAuthorized(params: AuthorizationCheckParams<TTargetResource, TOperations>): Promise<void> {
    if (!(await this.isAuthorized(params))) {
      throw new AuthorizationCheckError(params, `Authorization Error in ${this.constructor.name}: `);
    }
  }
}
