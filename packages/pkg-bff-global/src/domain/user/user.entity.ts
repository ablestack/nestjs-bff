import { BaseEntity } from './core/base.entity';
import { Length } from 'class-validator';

export class UserEntity extends BaseEntity {
  @Length(2, 50)
  username?: string;

  @Length(2, 50)
  displayName?: string;
}