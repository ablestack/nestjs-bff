import { OrganizationEntity } from '@nestjs-bff/universal/entities/organization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { IOrganizationDomainModel } from '../model/organization.domain.model';
import { OrganizationProviderTokens } from '../organization.domain.constants';
import { OrganizationDomainRepoCache } from './organization.domain.repo-cache';

@Injectable()
export class OrganizationDomainRepoWrite extends BaseRepoWrite<
  OrganizationEntity,
  IOrganizationDomainModel
> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(OrganizationProviderTokens.Models.Organization)
    model: Model<IOrganizationDomainModel>,
    organizationRepoCache: OrganizationDomainRepoCache,
  ) {
    super({ loggerService, model, entityRepoCache: organizationRepoCache });
  }
}
