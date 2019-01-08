import { UserEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { Document } from 'mongoose';

export interface IUserModel extends UserEntity, Document {}
