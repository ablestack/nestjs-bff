import { AccessPermissionsContract } from '../../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { Request as ExpressRequest } from 'express';

export interface BffRequest extends ExpressRequest {
  accessPermissions?: AccessPermissionsContract;
}
