import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from '../../core/repo/base.repo-cache';
import { IAuthorizationModel } from '../model/authorization.domain.model';
import { AuthorizationDomainRepoRead } from './authorization.domain.repo-read';
import { AuthorizationQueryConditions } from './authorization.query-conditions';

@Injectable()
export class AuthorizationRepoDomainCache extends BaseRepoCache<AuthorizationEntity, IAuthorizationModel, AuthorizationQueryConditions> {
  constructor(
    loggerService: LoggerSharedService,
    repo: AuthorizationDomainRepoRead,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App)
    nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      repo,
      cacheStore,
      ttl: nestjsBffConfig.caching.entities.user,
    });
  }
}
