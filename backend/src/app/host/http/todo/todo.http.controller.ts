import { AlwaysTrue } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/always-true.authorizationtest';
import { CheckUserOwnership } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/check-user-ownership.authorizationtest';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.http.decorator';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateTodoCommand } from '../../../../app/global/commands/create-todo.command';
import { TodoEntity } from '../../../../app/global/entities/todo.entity';
import { UserTodosApplicationService } from '../../../application/user-lists/user-todos.application.service';
import { TodoDomainRepoCache } from '../../../domain/todo/repo/todo.domain.cache-repo';

@Controller('/todo/:organizationSlug')
export class TodoHttpController {
  constructor(
    private readonly userTodosApplicationService: UserTodosApplicationService,
    private readonly todoRepoCache: TodoDomainRepoCache,
  ) {}

  @Post(':userId')
  @Authorization([new AlwaysTrue()])
  public async create(@Req() req, @Body() cmd: CreateTodoCommand) {
    const authorization: AuthorizationEntity = req.authorization;
    // tslint:disable-next-line:no-non-null-assertion (will have userId due to Authorization check)
    this.userTodosApplicationService.createMember(authorization.userId!, cmd);
  }

  @Get(':userId')
  @Authorization([new CheckUserOwnership()])
  public async findAll(): Promise<TodoEntity[]> {
    return this.todoRepoCache.findAll();
  }
}
