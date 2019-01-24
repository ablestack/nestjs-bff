import { AccessPermissionsContract } from '@nestjs-bff/global/lib/domain/access-permissions/access-permissions.contract';

export class AuthorizationCheckParams<TResource, TOperations> {
  accessPermissions: AccessPermissionsContract | null | undefined;
  origin: string = '';
  operation?: TOperations;
  targetResource?: TResource;
  data?: any;
}
