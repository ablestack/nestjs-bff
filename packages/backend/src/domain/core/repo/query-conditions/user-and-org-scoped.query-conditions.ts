import { IsDefined, IsMongoId } from 'class-validator';
import { OrgScopedQueryConditions } from './org-scoped.query-conditions';

export class UserAndOrgScopedQueryConditions extends OrgScopedQueryConditions {
  @IsDefined()
  @IsMongoId()
  public userId: string = '';
}
