import { CoreDomainModule } from '@nestjs-bff/backend/lib/domain/core/domain.core.module';
import { MongoSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/database/mongo/mongo.shared.constants';
import { Module } from '@nestjs/common';
import { TodoDomainSchema } from './model/todo.domain.schema';
import { TodoDomainRepoCache } from './repo/todo.domain.cache-repo';
import { TodoDomainRepoRead } from './repo/todo.domain.read-repo';
import { TodoDomainRepoWrite } from './repo/todo.domain.write-repo';
import { TodoProviderTokens } from './todo.domain.constants';

const TodoModelProvider = {
  provide: TodoProviderTokens.Models.Todo,
  useFactory: mongoose => mongoose.connection.model('Todo', TodoDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [TodoModelProvider, TodoDomainRepoRead, TodoDomainRepoCache, TodoDomainRepoWrite],
  exports: [TodoDomainRepoRead, TodoDomainRepoCache, TodoDomainRepoWrite],
})
export class TodoDomainModule {}
