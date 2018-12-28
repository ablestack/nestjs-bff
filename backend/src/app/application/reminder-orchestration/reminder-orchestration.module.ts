import { Module } from '@nestjs/common';
import { ReminderArchiveDomainModule } from '../../domain/reminder-archive/reminder-archive.module';
import { ReminderDomainModule } from '../../domain/reminder/reminder.module';
import { ReminderOrchestrationApplicationService } from './reminder-orchestration.service';

@Module({
  imports: [ReminderDomainModule, ReminderArchiveDomainModule],
  providers: [ReminderOrchestrationApplicationService],
  exports: [ReminderOrchestrationApplicationService],
})
export class ReminderOrchestrationApplicationModule {}
