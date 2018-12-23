import { BaseRepoWrite } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-write';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReminderArchiveEntity } from '../../../global/entities/reminder-archive.entity';
import { IReminderArchiveModel } from '../model/reminder-archive.domain.model';
import { ReminderArchiveProviderTokens } from '../reminder-archive.domain.constants';
import { ReminderArchiveDomainRepoCache } from './reminder-archive.domain.cache-repo';

@Injectable()
export class ReminderArchiveDomainRepoWrite extends BaseRepoWrite<ReminderArchiveEntity, IReminderArchiveModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(ReminderArchiveProviderTokens.Models.ReminderArchive) model: Model<IReminderArchiveModel>,
    reminderArchiveRepoCache: ReminderArchiveDomainRepoCache,
  ) {
    super({ loggerService, model, entityRepoCache: reminderArchiveRepoCache });
  }
}
