import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export abstract class AuthorizationCheck {
  abstract isAuthorized(data: IAuthorizationCheckData): Promise<boolean>;
}
