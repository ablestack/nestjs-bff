import { CoreDomainModule } from '@nestjs-bff/backend/lib/domain/core/domain.core.module';
import { MongoSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/database/mongo/mongo.shared.constants';
import { Module } from '@nestjs/common';
import { ReminderDomainSchema } from './model/reminder.domain.schema';
import { ReminderProviderTokens } from './reminder.domain.constants';
import { ReminderDomainRepoCache } from './repo/reminder.domain.cache-repo';
import { ReminderDomainRepoRead } from './repo/reminder.domain.read-repo';
import { ReminderDomainRepoWrite } from './repo/reminder.domain.write-repo';

const ReminderModelProvider = {
  provide: ReminderProviderTokens.Models.Reminder,
  useFactory: mongoose => mongoose.connection.model('Reminder', ReminderDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [ReminderModelProvider, ReminderDomainRepoRead, ReminderDomainRepoCache, ReminderDomainRepoWrite],
  exports: [ReminderDomainRepoRead, ReminderDomainRepoCache, ReminderDomainRepoWrite],
})
export class ReminderDomainModule {}
