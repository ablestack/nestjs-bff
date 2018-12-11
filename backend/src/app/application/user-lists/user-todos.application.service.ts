import { UserDomainRepoRead } from '@nestjs-bff/backend/lib/domain/user/repo/user.domain.repo-read';
import { Injectable } from '@nestjs/common';
import { TodoDomainRepoRead } from '../../domain/todo/repo/todo.domain.read-repo';

@Injectable()
export class UserTodosApplicationService {
  constructor(private readonly userRepoWrite: UserDomainRepoRead, private readonly todoRepoWrite: TodoDomainRepoRead) {}
}
