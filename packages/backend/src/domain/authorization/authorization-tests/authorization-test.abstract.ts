import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';

export abstract class AuthorizationTest {
  abstract isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean>;
}
