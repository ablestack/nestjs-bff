import { AlwaysFalse } from '../authorization-tests/always-false.authorizationtest';
import { AuthorizationTest } from '../authorization-tests/authorization-test.abstract';

export class AuthorizationPolicy {
  readonly create: AuthorizationTest[];
  readonly read: AuthorizationTest[];
  readonly update: AuthorizationTest[];
  readonly delete: AuthorizationTest[];

  constructor(auth: Partial<AuthorizationPolicy>) {
    this.create = auth.create || [AlwaysFalse.singleton];
    this.read = auth.read || [AlwaysFalse.singleton];
    this.update = auth.update || [AlwaysFalse.singleton];
    this.delete = auth.delete || [AlwaysFalse.singleton];
  }
}
