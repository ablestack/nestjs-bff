import { Document } from 'mongoose';
import { IAuthenticationDomainEntity } from './authentication.domain.entity';

export interface IAuthenticationDomainModel
  extends IAuthenticationDomainEntity,
    Document {}
