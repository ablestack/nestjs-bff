import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.http.module';
import { Module } from '@nestjs/common';
import { ReminderOrchestrationApplicationModule } from '../../../../application/reminder-orchestration/reminder-orchestration.application.module';
import { ReminderOrchestrationHttpController } from './reminder-orchestration.http.controller';

@Module({
  imports: [CoreHttpModule, ReminderOrchestrationApplicationModule],
  controllers: [ReminderOrchestrationHttpController],
  providers: [],
  exports: [],
})
export class ReminderOrchestrationHttpModule {}
