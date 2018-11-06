import { LoggerSysService } from '@nestjs-bff/backend/shared/logging/logger.shared.service';
import { Connection } from 'mongoose';
import { CatSchema } from '../../../../app/domain/cats/model/cat.domain.schema';
import { data } from './seed-data-dev';

/**
 * Make any changes you need to make to the database here
 */
export async function up(connection: Connection, bffLoggerService: LoggerSysService) {
  const newCats = data.entities;
  const cat = connection.model('Cat', CatSchema);
  const completed = await cat.collection.insertMany(newCats);
  bffLoggerService.info(`UP script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down(connection: Connection, bffLoggerService: LoggerSysService) {
  // Write migration here
  const newCats = data.entities;
  const idsToRemove = newCats.map(item => item._id);
  const cat = connection.model('Cat', CatSchema);
  const completed = await cat.collection.deleteMany({ _id: { $in: idsToRemove } });
  bffLoggerService.info(`DOWN script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}
