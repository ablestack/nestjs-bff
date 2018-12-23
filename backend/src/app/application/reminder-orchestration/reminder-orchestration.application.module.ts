import { Module } from '@nestjs/common';
import { ReminderArchiveDomainModule } from '../../domain/reminder-archive/reminder-archive.domain.module';
import { ReminderDomainModule } from '../../domain/reminder/reminder.domain.module';
import { ReminderOrchestrationApplicationService } from './reminder-orchestration.application.service';

@Module({
  imports: [ReminderDomainModule, ReminderArchiveDomainModule],
  providers: [ReminderOrchestrationApplicationService],
  exports: [ReminderOrchestrationApplicationService],
})
export class ReminderOrchestrationApplicationModule {}
