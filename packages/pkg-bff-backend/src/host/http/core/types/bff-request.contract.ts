import { AccessPermissionsContract } from '@nestjs-bff/global-contracts/lib/domain/access-permissions/access-permissions.contract';
import { Request as ExpressRequest } from 'express';

export interface BffRequest extends ExpressRequest {
  accessPermissions?: AccessPermissionsContract;
}
