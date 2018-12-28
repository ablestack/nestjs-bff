import { BaseQueryConditions } from '../../core/repo/base.query-conditions';

export class AuthenticationQueryConditions extends BaseQueryConditions {
  local?: {
    email: string;
  };

  google?: {
    id: string;
  };

  facebook?: {
    id: string;
  };

  twitter?: {
    id: string;
  };
}
