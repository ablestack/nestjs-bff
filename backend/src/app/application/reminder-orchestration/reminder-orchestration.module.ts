import { Module } from '@nestjs/common';
import { ReminderArchiveModule } from '../../domain/reminder-archive/reminder-archive.module';
import { ReminderModule } from '../../domain/reminder/reminder.module';
import { ReminderOrchestrationService } from './reminder-orchestration.service';

@Module({
  imports: [ReminderModule, ReminderArchiveModule],
  providers: [ReminderOrchestrationService],
  exports: [ReminderOrchestrationService],
})
export class ReminderOrchestrationModule {}
