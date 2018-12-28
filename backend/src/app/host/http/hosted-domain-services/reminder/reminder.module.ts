import { AuthorizationModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.module';
import { CoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { ReminderModule as DomainReminderModule } from '../../../../domain/reminder/reminder.module';
import { ReminderController } from './reminder.controller';

@Module({
  imports: [CoreModule, DomainReminderModule, AuthorizationModule],
  controllers: [ReminderController],
  providers: [],
  exports: [],
})
export class ReminderModule {}
