///

import { BaseRepoRead } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-read';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReminderEntity } from '../../../global/entities/reminder.entity';
import { IReminderModel } from '../model/reminder.domain.model';
import { ReminderProviderTokens } from '../reminder.domain.constants';
import { ReminderQueryConditions } from './reminder-query-conditions';

@Injectable()
export class ReminderRepoRead extends BaseRepoRead<ReminderEntity, IReminderModel, ReminderQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(ReminderProviderTokens.Models.Reminder) model: Model<IReminderModel>,
  ) {
    super({ loggerService, model });
  }
}
