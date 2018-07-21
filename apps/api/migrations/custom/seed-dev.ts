import { Connection } from 'mongoose';
import { CatSchema } from '../../src/cats/schemas/cat.schema';
import { data } from '../seeddata/seed-data-dev';
import { LoggerService } from '../../src/common/services/logger.service';

/**
 * Make any changes you need to make to the database here
 */
export async function up(connection: Connection, loggerService: LoggerService) {
  const newCats = data.entities;
  const cat = connection.model('Cat', CatSchema);
  const completed = await cat.collection.insertMany(newCats);
  loggerService.info(`UP script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down(connection: Connection, loggerService: LoggerService) {
  // Write migration here
  const newCats = data.entities;
  const idsToRemove = newCats.map(item => item._id);
  const cat = connection.model('Cat', CatSchema);
  const completed = await cat.collection.deleteMany({ _id: { $in: idsToRemove } });
  loggerService.info(`DOWN script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}
