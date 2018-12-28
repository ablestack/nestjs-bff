import { CoreDomainModule } from '@nestjs-bff/backend/lib/domain/core/domain.core.module';
import { MongoSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/database/mongo/mongo.shared.constants';
import { Module } from '@nestjs/common';
import { ReminderArchiveDomainSchema } from './model/reminder-archive.schema';
import { ReminderArchiveProviderTokens } from './reminder-archive.constants';
import { ReminderArchiveDomainRepoCache } from './repo/reminder-archive.cache-repo';
import { ReminderArchiveDomainRepo } from './repo/reminder-archive.repo';
import { ReminderArchiveDomainRepoWrite } from './repo/reminder-archive.write-repo';

const ReminderArchiveModelProvider = {
  provide: ReminderArchiveProviderTokens.Models.ReminderArchive,
  useFactory: mongoose => mongoose.connection.model('ReminderArchive', ReminderArchiveDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [
    ReminderArchiveModelProvider,
    ReminderArchiveDomainRepo,
    ReminderArchiveDomainRepoCache,
    ReminderArchiveDomainRepoWrite,
  ],
  exports: [ReminderArchiveDomainRepo, ReminderArchiveDomainRepoCache, ReminderArchiveDomainRepoWrite],
})
export class ReminderArchiveDomainModule {}
