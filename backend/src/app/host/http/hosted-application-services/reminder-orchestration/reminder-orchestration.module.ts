import { CoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import * as Application from '../../../../application';
import { ReminderOrchestrationController } from './reminder-orchestration.controller';

@Module({
  imports: [CoreModule, Application.ReminderOrchestrationModule],
  controllers: [ReminderOrchestrationController],
  providers: [],
  exports: [],
})
export class ReminderOrchestrationModule {}
