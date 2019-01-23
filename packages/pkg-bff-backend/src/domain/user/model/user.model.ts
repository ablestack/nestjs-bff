import { UserEntity } from '@nestjs-bff/global/lib/domain/user/user.entity';
import { Document } from 'mongoose';

export interface IUserModel extends UserEntity, Document {}
