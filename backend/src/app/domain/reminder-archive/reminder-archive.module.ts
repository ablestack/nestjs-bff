import { MongoSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/database/mongo/mongo.shared.constants';
import { Module } from '@nestjs/common';
import { CoreModule } from '../../../packages/backend/lib/domain/core/core.module';
import { ReminderArchiveSchema } from './model/reminder-archive.schema';
import { ReminderArchiveProviderTokens } from './reminder-archive.constants';
import { ReminderArchiveRepo } from './repo/reminder-archive.repo';

const ReminderArchiveModelProvider = {
  provide: ReminderArchiveProviderTokens.Models.ReminderArchive,
  useFactory: mongoose => mongoose.connection.model('ReminderArchive', ReminderArchiveSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreModule],
  providers: [ReminderArchiveModelProvider, ReminderArchiveRepo, ReminderArchiveRepo, ReminderArchiveRepo],
  exports: [ReminderArchiveRepo, ReminderArchiveRepo, ReminderArchiveRepo],
})
export class ReminderArchiveModule {}
