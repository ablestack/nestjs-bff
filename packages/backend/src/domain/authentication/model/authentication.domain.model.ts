import { Document } from 'mongoose';
import { AuthenticationDomainEntity } from './authentication.domain.entity';

export interface IAuthenticationDomainModel extends AuthenticationDomainEntity, Document {}
