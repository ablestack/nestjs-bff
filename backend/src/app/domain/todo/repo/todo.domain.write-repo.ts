import { BaseRepoWrite } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-write';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TodoEntity } from '../../../global/entities/todo.entity';
import { ITodoModel } from '../model/todo.domain.model';
import { TodoProviderTokens } from '../todo.domain.constants';
import { TodoDomainRepoCache } from './todo.domain.cache-repo';

@Injectable()
export class TodoDomainRepoWrite extends BaseRepoWrite<TodoEntity, ITodoModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(TodoProviderTokens.Models.Todo) model: Model<ITodoModel>,
    todoRepoCache: TodoDomainRepoCache,
  ) {
    super({ loggerService, model, entityRepoCache: todoRepoCache });
  }
}
