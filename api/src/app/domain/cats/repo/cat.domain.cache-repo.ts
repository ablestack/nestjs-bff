import { BaseRepoCache } from '@nestjs-bff/backend/domain/core/repo/base.repo-cache';
import { AppSysProviderTokens } from '@nestjs-bff/backend/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/shared/caching/caching.shared.constants';
import { LoggerSysService } from '@nestjs-bff/backend/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAppConfig } from 'config/app.config';
import { CatEntity } from '../../../universal/entities/cat.entity';
import { ICatModel } from '../model/cat.domain.model';
import { CatRepoRead } from './cat.domain.read-repo';

@Injectable()
export class CatRepoCache extends BaseRepoCache<CatEntity, ICatModel> {
  constructor(
    repo: CatRepoRead,
    loggerService: LoggerSysService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSysProviderTokens.Config.App) appConfig: IAppConfig,
  ) {
    super({ loggerService, repo, cacheStore, ttl: appConfig.caching.entities.cat });
  }
}
