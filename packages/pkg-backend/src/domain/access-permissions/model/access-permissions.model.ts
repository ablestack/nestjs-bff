import { Document } from 'mongoose';
import { AccessPermissionsEntity } from './access-permissions.entity';

export interface IAccessPermissionsModel extends AccessPermissionsEntity, Document {}
