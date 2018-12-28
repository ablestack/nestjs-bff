import { AuthorizationModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { UserRemindersApplicationModule } from '../../../application/user-lists/user-reminders.module';
import { ReminderModule } from '../../../domain/reminder/reminder.module';
import { ReminderHttpController } from './reminder.controller';

@Module({
  imports: [CoreHttpModule, UserRemindersApplicationModule, ReminderModule, AuthorizationModule],
  controllers: [ReminderHttpController],
  providers: [],
  exports: [],
})
export class ReminderHttpModule {}
