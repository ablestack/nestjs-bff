import { AuthorizationModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.module';
import { CoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { UserRemindersModule } from '../../../application/user-lists/user-reminders.module';
import { ReminderModule } from '../../../domain/reminder/reminder.module';
import { ReminderController } from './reminder.controller';

@Module({
  imports: [CoreModule, UserRemindersModule, ReminderModule, AuthorizationModule],
  controllers: [ReminderController],
  providers: [],
  exports: [],
})
export class ReminderModule {}
