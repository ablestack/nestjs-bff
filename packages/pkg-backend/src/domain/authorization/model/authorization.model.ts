import { Document } from 'mongoose';
import { AuthorizationEntity } from './authorization.entity';

export interface IAuthorizationModel extends AuthorizationEntity, Document {}
