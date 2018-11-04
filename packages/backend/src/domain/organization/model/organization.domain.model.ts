import { OrganizationEntity } from '@nestjs-bff/universal/entities/organization.entity';
import { Document } from 'mongoose';

export interface IOrganizationDomainModel
  extends OrganizationEntity,
    Document {}
