import { BaseRepoCache } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-cache';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAppConfig } from '../../../../config/app.config';
import { ReminderArchiveEntity } from '../../../global/entities/reminder-archive.entity';
import { IReminderArchiveModel } from '../model/reminder-archive.domain.model';
import { ReminderArchiveDomainRepoRead } from './reminder-archive.domain.read-repo';

@Injectable()
export class ReminderArchiveDomainRepoCache extends BaseRepoCache<ReminderArchiveEntity, IReminderArchiveModel> {
  constructor(
    private _repo: ReminderArchiveDomainRepoRead,
    loggerService: LoggerSharedService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
  ) {
    super({ loggerService, repo: _repo, cacheStore, ttl: appConfig.caching.entities.reminderArchive });
  }

  public async findByUserId(userId: string): Promise<ReminderArchiveEntity[]> {
    return this.cacheStore.wrap(
      this.makeCacheKeyFromIdentifier(userId, 'userId'),
      () => this._repo.findByUserId(userId),
      {
        ttl: this.ttl,
      },
    );
  }
}
