import { Module } from '@nestjs/common';
import { ReminderArchiveModule } from '../../domain/reminder-archive/reminder-archive.module';
import { ReminderModule } from '../../domain/reminder/reminder.module';
import { ReminderOrchestrationApplicationService } from './reminder-orchestration.service';

@Module({
  imports: [ReminderModule, ReminderArchiveModule],
  providers: [ReminderOrchestrationApplicationService],
  exports: [ReminderOrchestrationApplicationService],
})
export class ReminderOrchestrationApplicationModule {}
