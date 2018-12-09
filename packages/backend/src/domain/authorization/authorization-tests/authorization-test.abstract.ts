import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';

export abstract class AuthorizationTest {
  abstract isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean>;
}
