import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { Document } from 'mongoose';

export interface IAuthorizationModel extends AuthorizationEntity, Document {}
