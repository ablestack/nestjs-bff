import { AuthorizationCheckParams } from '../authchecks/authorization-params';
import { AuthorizationError } from './authorization.exception';

export class AuthorizationCheckError extends AuthorizationError {
  constructor(authorizationCheckParams: AuthorizationCheckParams<any, any>) {
    const message = `Authorization failed: ${authorizationCheckParams.toString()}`;
    super(message, authorizationCheckParams);
    Error.captureStackTrace(this, AuthorizationError);
  }
}
