import { AuthorizationEntity } from '@nestjs-bff/global/lib/lib/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';

export class AlwaysTrue extends AuthorizationTest {
  private static _singleton: AuthorizationTest = new AlwaysTrue();
  public static get singleton(): AuthorizationTest {
    return AlwaysTrue._singleton;
  }

  public async isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean> {
    return true;
  }
}
