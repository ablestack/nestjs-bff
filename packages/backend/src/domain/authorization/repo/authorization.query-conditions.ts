import { IsMongoId } from 'class-validator';
import { UserScopedQueryConditions } from '../../core/repo/user-scoped.query-conditions';

export class AuthorizationQueryConditions extends UserScopedQueryConditions {
  @IsMongoId()
  public userId: string = '';
}
