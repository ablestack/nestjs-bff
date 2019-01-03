import { IsNotEmpty, IsString } from 'class-validator';
import { UserAndOrgScopedQueryConditions } from '../../../repo/query-conditions/user-and-org-scoped.query-conditions';

export class FooQueryConditions extends UserAndOrgScopedQueryConditions {
  @IsString()
  @IsNotEmpty()
  public slug?: string;
}
