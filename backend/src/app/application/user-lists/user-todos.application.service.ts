import { UserDomainRepoCache } from '@nestjs-bff/backend/lib/domain/user/repo/user.domain.repo-cache';
import { Injectable } from '@nestjs/common';
import { TodoDomainRepoWrite } from '../../domain/todo/repo/todo.domain.write-repo';
import { CreateTodoCommand } from '../../global/commands/create-todo.command';

@Injectable()
export class UserTodosApplicationService {
  constructor(
    private readonly userRepoCache: UserDomainRepoCache,
    private readonly todoRepoWrite: TodoDomainRepoWrite,
  ) {}

  public async createMember(userId: string, cmd: CreateTodoCommand): Promise<void> {
    // get user
    const user = await this.userRepoCache.findOneById(userId);

    // create todo
    this.todoRepoWrite.create({ userId, userName: user.username, Title: cmd.title, Completed: false });
  }
}
