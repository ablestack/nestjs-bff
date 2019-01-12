import { Document } from 'mongoose';
import { UserPermissionsEntity } from './user-permissions.entity';

export interface IUserPermissionsModel extends UserPermissionsEntity, Document {}
