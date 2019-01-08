import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AuthCheckContract } from './authcheck.contract';

export abstract class EntityAuthCheckContract implements AuthCheckContract {
  abstract isAuthorized(credentials: UserCredentialsContract | undefined | null, dataToCheck: IEntity): Promise<boolean>;
}
