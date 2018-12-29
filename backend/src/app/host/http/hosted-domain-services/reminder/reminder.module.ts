import { DomainAuthorizationModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.module';
import { HttpCoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { DomainReminderModule } from '../../../../domain/reminder/reminder.module';
import { ReminderController } from './reminder.controller';

@Module({
  imports: [HttpCoreModule, DomainReminderModule, DomainAuthorizationModule],
  controllers: [ReminderController],
  providers: [],
  exports: [],
})
export class HttpReminderModule {}
