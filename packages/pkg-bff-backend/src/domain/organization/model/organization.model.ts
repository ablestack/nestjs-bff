import { OrganizationEntity } from '@nestjs-bff/global/lib/domain/organization/organization.entity';
import { Document } from 'mongoose';

export interface IOrganizationModel extends OrganizationEntity, Document {}
