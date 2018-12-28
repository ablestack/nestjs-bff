import { CoreDomainModule } from '@nestjs-bff/backend/lib/domain/core/domain.core.module';
import { MongoSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/database/mongo/mongo.shared.constants';
import { Module } from '@nestjs/common';
import { ReminderDomainSchema } from './model/reminder.schema';
import { ReminderProviderTokens } from './reminder.constants';
import { ReminderDomainRepoCache } from './repo/reminder.cache-repo';
import { ReminderDomainRepo } from './repo/reminder.repo';
import { ReminderDomainRepoWrite } from './repo/reminder.write-repo';

const ReminderModelProvider = {
  provide: ReminderProviderTokens.Models.Reminder,
  useFactory: mongoose => mongoose.connection.model('Reminder', ReminderDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [ReminderModelProvider, ReminderDomainRepo, ReminderDomainRepoCache, ReminderDomainRepoWrite],
  exports: [ReminderDomainRepo, ReminderDomainRepoCache, ReminderDomainRepoWrite],
})
export class ReminderDomainModule {}
