import { Module } from '@nestjs/common';
import { DomainReminderArchiveModule } from '../../domain/reminder-archive/reminder-archive.module';
import { DomainReminderModule } from '../../domain/reminder/reminder.module';
import { ReminderOrchestrationService } from './reminder-orchestration.service';

@Module({
  imports: [DomainReminderModule, DomainReminderArchiveModule],
  providers: [ReminderOrchestrationService],
  exports: [ReminderOrchestrationService],
})
export class ApplicationReminderOrchestrationModule {}
