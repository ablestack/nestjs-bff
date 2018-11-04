import { Document } from 'mongoose';
import { IAuthenticationDomainEntity } from './i-authentication.domain.entity';

export interface IAuthenticationDomainModel extends IAuthenticationDomainEntity, Document {}
