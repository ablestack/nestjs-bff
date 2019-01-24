import { BaseEntity } from '../core/base.entity';
import { Length } from 'class-validator';

export class OrganizationEntity extends BaseEntity {
  @Length(2, 50)
  name?: string;

  @Length(2, 50)
  slug?: string;
}
