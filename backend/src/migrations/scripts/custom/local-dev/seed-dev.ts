import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Connection } from 'mongoose';
import { TodoDomainSchema } from '../../../../app/domain/todo/model/todo.domain.schema';
import { data } from './seed-data-dev';

/**
 * Make any changes you need to make to the database here
 */
export async function up(connection: Connection, bffLoggerService: LoggerSharedService) {
  const newTodos = data.entities;
  const todo = connection.model('Todo', TodoDomainSchema);
  const completed = await todo.collection.insertMany(newTodos);
  bffLoggerService.info(`UP script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down(connection: Connection, bffLoggerService: LoggerSharedService) {
  // Write migration here
  const newTodos = data.entities;
  const idsToRemove = newTodos.map(item => item._id);
  const todo = connection.model('Todo', TodoDomainSchema);
  const completed = await todo.collection.deleteMany({ _id: { $in: idsToRemove } });
  bffLoggerService.info(`DOWN script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}
