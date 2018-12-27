import { BaseRepoCache } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-cache';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAppConfig } from '../../../../config/app.config';
import { ReminderEntity } from '../../../global/entities/reminder.entity';
import { IReminderModel } from '../model/reminder.domain.model';
import { ReminderRepoRead } from './reminder.read-repo';

@Injectable()
export class ReminderRepoCache extends BaseRepoCache<ReminderEntity, IReminderModel> {
  constructor(
    private _repo: ReminderRepoRead,
    loggerService: LoggerSharedService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
  ) {
    super({ loggerService, repo: _repo, cacheStore, ttl: appConfig.caching.entities.reminder });
  }
}
