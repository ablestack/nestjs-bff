import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';

export class AlwaysFalse extends AuthorizationTest {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthorizationTest = new AlwaysFalse();
  public static get singleton(): AuthorizationTest {
    return AlwaysFalse._singleton;
  }
  public async isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean> {
    return false;
  }
}
