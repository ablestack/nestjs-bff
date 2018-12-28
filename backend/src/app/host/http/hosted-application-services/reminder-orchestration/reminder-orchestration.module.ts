import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { ReminderOrchestrationApplicationModule } from '../../../../application/reminder-orchestration/reminder-orchestration.module';
import { ReminderOrchestrationHttpController } from './reminder-orchestration.controller';

@Module({
  imports: [CoreHttpModule, ReminderOrchestrationApplicationModule],
  controllers: [ReminderOrchestrationHttpController],
  providers: [],
  exports: [],
})
export class ReminderOrchestrationHttpModule {}
