import { IEntity } from '../interfaces/entity.interface';

export class UserEntity implements IEntity {
  id?: any;
  username: string = '';
  displayName: string = '';
}
