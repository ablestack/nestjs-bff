import { BaseRepo } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo';
import { QueryValidatorService } from '@nestjs-bff/backend/lib/domain/core/repo/validators/query-validator.service';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IAppConfig } from '../../../../config/app.config';
import { ReminderArchiveEntity } from '../../../global/entities/reminder-archive.entity';
import { IReminderArchiveModel } from '../model/reminder-archive.model';
import { ReminderArchiveProviderTokens } from '../reminder-archive.constants';
import { ReminderArchiveQueryConditions } from './reminder-archive-query-conditions';

@Injectable()
export class ReminderArchiveRepo extends BaseRepo<
  ReminderArchiveEntity,
  IReminderArchiveModel,
  ReminderArchiveQueryConditions
> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(ReminderArchiveProviderTokens.Models.ReminderArchive) model: Model<IReminderArchiveModel>,
    queryValidatorService: QueryValidatorService<ReminderArchiveQueryConditions>,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      defaultTTL: appConfig.caching.entities.reminderArchive,
      queryValidatorService,
      queryConditionsType: ReminderArchiveQueryConditions,
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: ReminderArchiveEntity): ReminderArchiveQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
