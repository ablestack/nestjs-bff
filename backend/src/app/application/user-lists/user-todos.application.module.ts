import { UserDomainModule } from '@nestjs-bff/backend/lib/domain/user/user.domain.module';
import { Module } from '@nestjs/common';
import { TodoDomainModule } from '../../domain/todo/todo.domain.module';
import { UserTodosApplicationService } from './user-todos.application.service';

@Module({
  imports: [UserDomainModule, TodoDomainModule],
  providers: [UserTodosApplicationService],
  exports: [UserTodosApplicationService],
})
export class UserTodosApplicationModule {}
