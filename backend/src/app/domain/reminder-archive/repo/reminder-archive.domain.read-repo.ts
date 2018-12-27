import { BaseRepoRead } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-read';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReminderArchiveEntity } from '../../../global/entities/reminder-archive.entity';
import { IReminderArchiveModel } from '../model/reminder-archive.domain.model';
import { ReminderArchiveProviderTokens } from '../reminder-archive.domain.constants';

@Injectable()
export class ReminderArchiveDomainRepoRead extends BaseRepoRead<ReminderArchiveEntity, IReminderArchiveModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(ReminderArchiveProviderTokens.Models.ReminderArchive) model: Model<IReminderArchiveModel>,
  ) {
    super({ loggerService, model });
  }
}
