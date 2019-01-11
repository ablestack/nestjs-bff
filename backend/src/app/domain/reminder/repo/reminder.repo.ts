import { BaseRepo } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { ReminderEntity } from '@nestjs-bff/global/entities/reminder.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IAppConfig } from '../../../../config/app.config';
import { IReminderModel } from '../model/reminder.model';
import { ReminderProviderTokens } from '../reminder.constants';
import { ReminderEntity } from './reminder-query-conditions';

@Injectable()
export class ReminderRepo extends BaseRepo<ReminderEntity, IReminderModel, ReminderEntity> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(ReminderProviderTokens.Models.Reminder) model: Model<IReminderModel>,
    entityValidator: ClassValidator<ReminderEntity>,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      defaultTTL: appConfig.caching.entities.reminder,
      entityValidator,
      entityType: ReminderEntity,
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: ReminderEntity): ReminderEntity[] {
    throw new Error('Method not implemented.');
  }
}
