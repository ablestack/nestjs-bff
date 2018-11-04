import { IEntity } from '../interfaces/entity.interface';

export class OrganizationEntity implements IEntity {
  id?: any;
  readonly name: string = '';
  readonly slug: string = '';
}
