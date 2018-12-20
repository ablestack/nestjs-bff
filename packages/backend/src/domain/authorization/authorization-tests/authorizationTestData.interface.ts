import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';

export interface IAuthorizationTestData {
  requestingEntity?: AuthorizationEntity;
  organizationIdForTargetResource?: string;
  userIdForTargetResource?: string;
}
