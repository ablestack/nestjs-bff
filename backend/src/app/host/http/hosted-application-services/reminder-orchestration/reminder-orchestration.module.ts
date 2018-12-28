import { CoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { ReminderOrchestrationModule } from '../../../../application/reminder-orchestration/reminder-orchestration.module';
import { ReminderOrchestrationController } from './reminder-orchestration.controller';

@Module({
  imports: [CoreModule, ReminderOrchestrationModule],
  controllers: [ReminderOrchestrationController],
  providers: [],
  exports: [],
})
export class ReminderOrchestrationModule {}
