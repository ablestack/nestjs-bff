import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Connection } from 'mongoose';
import { ReminderSchema } from '../../../../app/domain/reminder/model/reminder.schema';
import { data } from './seed-data-dev';

/**
 * Make any changes you need to make to the database here
 */
export async function up(connection: Connection, bffLoggerService: LoggerSharedService) {
  const newReminders = data.entities;
  const reminder = connection.model('Reminder', ReminderSchema);
  const completed = await reminder.collection.insertMany(newReminders);
  bffLoggerService.info(`UP script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down(connection: Connection, bffLoggerService: LoggerSharedService) {
  // Write migration here
  const newReminders = data.entities;
  const idsToRemove = newReminders.map(item => item.id);
  const reminder = connection.model('Reminder', ReminderSchema);
  const completed = await reminder.collection.deleteMany({ id: { $in: idsToRemove } });
  bffLoggerService.info(`DOWN script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
}
