import { AuthorizationDomainModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { UserRemindersApplicationModule } from '../../../application/user-lists/user-reminders.module';
import { ReminderDomainModule } from '../../../domain/reminder/reminder.module';
import { ReminderHttpController } from './reminder.controller';

@Module({
  imports: [CoreHttpModule, UserRemindersApplicationModule, ReminderDomainModule, AuthorizationDomainModule],
  controllers: [ReminderHttpController],
  providers: [],
  exports: [],
})
export class ReminderHttpModule {}
