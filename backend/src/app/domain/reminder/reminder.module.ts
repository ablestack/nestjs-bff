import { CoreModule } from '@nestjs-bff/backend/lib/domain/core/core.module';
import { MongoSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/database/mongo/mongo.shared.constants';
import { Module } from '@nestjs/common';
import { ReminderSchema } from './model/reminder.schema';
import { ReminderProviderTokens } from './reminder.constants';
import { ReminderRepo } from './repo/reminder.repo';

const ReminderModelProvider = {
  provide: ReminderProviderTokens.Models.Reminder,
  useFactory: mongoose => mongoose.connection.model('Reminder', ReminderSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreModule],
  providers: [ReminderModelProvider, ReminderRepo, ReminderRepo, ReminderRepo],
  exports: [ReminderRepo, ReminderRepo, ReminderRepo],
})
export class ReminderModule {}
