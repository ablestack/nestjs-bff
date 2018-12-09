import { BaseRepoCache } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-cache';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAppConfig } from '../../../../config/app.config';
import { CatEntity } from '../../../global/entities/cat.entity';
import { ICatModel } from '../model/cat.domain.model';
import { CatRepoRead } from './cat.domain.read-repo';

@Injectable()
export class CatRepoCache extends BaseRepoCache<CatEntity, ICatModel> {
  constructor(
    repo: CatRepoRead,
    loggerService: LoggerSharedService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
  ) {
    super({ loggerService, repo, cacheStore, ttl: appConfig.caching.entities.cat });
  }
}
