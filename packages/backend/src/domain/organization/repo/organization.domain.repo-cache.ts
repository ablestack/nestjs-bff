import { OrganizationEntity } from '@nestjs-bff/global/lib/entities/organization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from '../../core/repo/base.repo-cache';
import { IOrganizationDomainModel } from '../model/organization.domain.model';
import { OrganizationDomainRepoRead } from './organization.domain.repo-read';
import { OrganizationQueryConditions } from './organization.query-conditions';

@Injectable()
export class OrganizationDomainRepoCache extends BaseRepoCache<OrganizationEntity, IOrganizationDomainModel, OrganizationQueryConditions> {
  constructor(
    repo: OrganizationDomainRepoRead,
    loggerService: LoggerSharedService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App)
    nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      repo,
      cacheStore,
      ttl: nestjsBffConfig.caching.entities.organization,
    });
  }
}
