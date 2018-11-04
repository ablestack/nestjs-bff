import { IEntity } from '../interfaces/entity.interface';

export class UserDomainEntity implements IEntity {
  id?: any;
  username: string = '';
  displayName: string = '';
}
