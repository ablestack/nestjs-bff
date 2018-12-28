import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IAppConfig } from '../../../../config/app.config';
import { ReminderEntity } from '../../../global/entities/reminder.entity';
import { IReminderModel } from '../model/reminder.model';
import { ReminderProviderTokens } from '../reminder.constants';
import { ReminderQueryConditions } from './reminder-query-conditions';

@Injectable()
export class ReminderRepo extends BaseRepo<ReminderEntity, IReminderModel, ReminderQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(ReminderProviderTokens.Models.Reminder) model: Model<IReminderModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
  ) {
    super({ loggerService, model, cacheStore, defaultTTL: appConfig.caching.entities.reminder });
  }

  protected generateValidQueryConditionsForCacheClear(entity: ReminderEntity): ReminderQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
