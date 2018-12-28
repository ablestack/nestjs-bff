import { IsMongoId } from 'class-validator';
import { BaseQueryConditions } from './base.query-conditions';

export class OrgScopedQueryConditions extends BaseQueryConditions {
  @IsMongoId()
  public readonly orgId: string = '';
}
