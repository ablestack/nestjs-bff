import { AuthorizationDomainModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.http.module';
import { Module } from '@nestjs/common';
import { TodoDomainModule } from '../../../domain/todo/todo.domain.module';
import { TodoHttpController } from './todo.http.controller';

@Module({
  imports: [CoreHttpModule, TodoDomainModule, AuthorizationDomainModule],
  controllers: [TodoHttpController],
  providers: [],
  exports: [],
})
export class TodoHttpModule {}
