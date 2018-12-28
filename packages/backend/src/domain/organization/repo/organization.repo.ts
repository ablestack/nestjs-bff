import { OrganizationEntity } from '@nestjs-bff/global/lib/entities/organization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { IOrganizationDomainModel } from '../model/organization.model';
import { OrganizationProviderTokens } from '../organization.constants';
import { OrganizationQueryConditions } from './organization.query-conditions';

@Injectable()
export class OrganizationDomainRepo extends BaseRepo<OrganizationEntity, IOrganizationDomainModel, OrganizationQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(OrganizationProviderTokens.Models.Organization) model: Model<IOrganizationDomainModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({ loggerService, model, cacheStore, defaultTTL: nestjsBffConfig.caching.entities.user });
  }

  protected generateValidQueryConditionsForCacheClear(entity: OrganizationEntity): OrganizationQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
