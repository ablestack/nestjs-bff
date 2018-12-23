import { AuthorizationDomainModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.http.module';
import { Module } from '@nestjs/common';
import { UserTodosApplicationModule } from '../../../application/user-lists/user-todos.application.module';
import { ReminderDomainModule } from '../../../domain/todo/reminder.domain.module';
import { TodoHttpController } from './todo.http.controller';

@Module({
  imports: [CoreHttpModule, UserTodosApplicationModule, ReminderDomainModule, AuthorizationDomainModule],
  controllers: [TodoHttpController],
  providers: [],
  exports: [],
})
export class TodoHttpModule {}
