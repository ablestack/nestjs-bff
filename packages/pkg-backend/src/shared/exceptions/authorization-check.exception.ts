import { AuthorizationCheckParams } from '../authchecks/authorization-params';
import { AuthorizationError } from './authorization.exception';

export class AuthorizationCheckError extends AuthorizationError {
  constructor(authorizationCheckParams: AuthorizationCheckParams<any, any>, message?: string) {
    message = (message || 'Authorization failed: ') + `${JSON.stringify(authorizationCheckParams, null, 2)}`;
    super(message, authorizationCheckParams);
    Error.captureStackTrace(this, AuthorizationError);
  }
}
