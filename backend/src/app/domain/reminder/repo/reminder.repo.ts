import { BaseRepo } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo';
import { ClassValidator } from '@nestjs-bff/backend/lib/domain/core/validators/class-validator';
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

@Injectable()
export class ReminderRepo extends BaseRepo<ReminderEntity> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(ReminderProviderTokens.Models.Reminder) model: Model<IReminderModel>,
  ) {
    super({
      loggerService,
      cacheStore,
      defaultTTL: appConfig.caching.entities.reminder,
      model,
      entityValidator: new ClassValidator<ReminderEntity>(loggerService, ReminderEntity),
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: ReminderEntity): object[] {
    return [{ id: entity.id, userId: entity.userId, orgId: entity.orgId }];
  }
}
