import { BaseRepo } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo';
import { ClassValidator } from '@nestjs-bff/backend/lib/domain/core/validators/class-validator';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { ReminderArchiveEntity } from '@yourapp/global/lib/domain/reminder-archive/reminder-archive.entity';
import { Model } from 'mongoose';
import { IAppConfig } from '../../../../config/app.config';
import { IReminderArchiveModel } from '../model/reminder-archive.model';
import { ReminderArchiveProviderTokens } from '../reminder-archive.constants';

@Injectable()
export class ReminderArchiveRepo extends BaseRepo<ReminderArchiveEntity> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(ReminderArchiveProviderTokens.Models.ReminderArchive) model: Model<IReminderArchiveModel>,
  ) {
    super({
      loggerService,
      cacheStore,
      defaultTTL: appConfig.caching.entities.reminderArchive,
      model,
      entityValidator: new ClassValidator<ReminderArchiveEntity>(loggerService, ReminderArchiveEntity),
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: ReminderArchiveEntity): object[] {
    return [{ id: entity.id, userId: entity.userId, orgId: entity.orgId }];
  }
}
