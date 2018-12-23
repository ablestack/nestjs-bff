import { AuthorizationDomainModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.http.module';
import { Module } from '@nestjs/common';
import { UserRemindersApplicationModule } from '../../../application/user-lists/user-reminders.application.module';
import { ReminderDomainModule } from '../../../domain/reminder/reminder.domain.module';
import { ReminderHttpController } from './reminder.http.controller';

@Module({
  imports: [CoreHttpModule, UserRemindersApplicationModule, ReminderDomainModule, AuthorizationDomainModule],
  controllers: [ReminderHttpController],
  providers: [],
  exports: [],
})
export class ReminderHttpModule {}
