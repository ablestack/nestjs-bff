import { UserDomainEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { Document } from 'mongoose';

export interface IUserDomainModel extends UserDomainEntity, Document {}
