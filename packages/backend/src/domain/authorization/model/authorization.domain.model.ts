import { AuthorizationEntity } from '@nestjs-bff/global/entities/authorization.entity';
import { Document } from 'mongoose';

export interface IAuthorizationModel extends AuthorizationEntity, Document {}
