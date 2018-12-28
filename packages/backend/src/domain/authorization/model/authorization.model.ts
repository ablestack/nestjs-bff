import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Document } from 'mongoose';

export interface IAuthorizationModel extends AuthorizationEntity, Document {}
