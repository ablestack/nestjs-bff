import { Document } from 'mongoose';
import { AuthenticationEntity } from './authentication.entity';

export interface IAuthenticationModel extends AuthenticationEntity, Document {}
