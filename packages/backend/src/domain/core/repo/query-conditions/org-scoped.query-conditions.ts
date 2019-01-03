import { IsDefined, IsMongoId } from 'class-validator';
import { BaseQueryConditions } from './base.query-conditions';

export class OrgScopedQueryConditions extends BaseQueryConditions {
  @IsDefined()
  @IsMongoId()
  public orgId: string = '';
}
