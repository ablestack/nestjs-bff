import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { UnauthorizedError } from '../../../shared/exceptions/unauthorized.exception';

export abstract class AuthCheckContract<TData> {
  abstract isAuthorized(credentials: UserCredentialsContract | null | undefined, dataToCheck?: TData): Promise<boolean>;

  async ensureAuthorized(credentials: UserCredentialsContract | null | undefined, dataToCheck?: TData): Promise<void> {
    if (!(await this.isAuthorized(credentials, dataToCheck))) {
      throw new UnauthorizedError(`Not Authorized`, { data: dataToCheck, authorization: credentials });
    }
  }
}
