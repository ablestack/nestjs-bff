import { UserDomainEntity } from '@nestjs-bff/universal/entities/user.entity';
import { Document } from 'mongoose';

export interface IUserDomainModel extends UserDomainEntity, Document {}
