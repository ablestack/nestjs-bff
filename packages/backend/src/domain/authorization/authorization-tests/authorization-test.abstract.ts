import { AuthorizationEntity } from '@nestjs-bff/global/entities/authorization.entity';

export abstract class AuthorizationTest {
  abstract isAuthorized(
    requestingEntity?: AuthorizationEntity,
    organizationIdForRequestedResource?: string,
  ): Promise<boolean>;
}
