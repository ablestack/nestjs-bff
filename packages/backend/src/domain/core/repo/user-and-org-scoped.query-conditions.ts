import { IsMongoId } from 'class-validator';
import { OrgScopedQueryConditions } from './org-scoped.query-conditions';

export class UserAndOrgScopedQueryConditions extends OrgScopedQueryConditions {
  @IsMongoId()
  public readonly userId: string = '';
}
