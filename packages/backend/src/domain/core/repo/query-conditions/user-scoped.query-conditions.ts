import { IsMongoId } from 'class-validator';
import { BaseQueryConditions } from './base.query-conditions';

export class UserScopedQueryConditions extends BaseQueryConditions {
  @IsMongoId()
  public readonly userId: string = '';
}
