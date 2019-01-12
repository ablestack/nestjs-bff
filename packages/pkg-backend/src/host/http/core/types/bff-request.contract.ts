import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';
import { Request as ExpressRequest } from 'express';

export interface BffRequest extends ExpressRequest {
  accessPermissions?: AccessPermissionsContract;
}
