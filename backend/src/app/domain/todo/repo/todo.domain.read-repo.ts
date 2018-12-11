import { BaseRepoRead } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-read';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TodoEntity } from '../../../global/entities/todo.entity';
import { ITodoModel } from '../model/todo.domain.model';
import { TodoProviderTokens } from '../todo.domain.constants';

@Injectable()
export class TodoDomainRepoRead extends BaseRepoRead<TodoEntity, ITodoModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(TodoProviderTokens.Models.Todo) model: Model<ITodoModel>,
  ) {
    super({ loggerService, model });
  }
}
