import { IsDefined, IsMongoId } from 'class-validator';
import { BaseQueryConditions } from './base.query-conditions';

export class UserScopedQueryConditions extends BaseQueryConditions {
  @IsDefined()
  @IsMongoId()
  public readonly userId: string = '';
}
