import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';

export interface IAuthorizationCheckData {
  requestingEntity?: AuthorizationEntity;
  organizationIdForTargetResource?: string;
  userIdForTargetResource?: string;
}
