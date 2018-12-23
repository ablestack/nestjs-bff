import { UserDomainModule } from '@nestjs-bff/backend/lib/domain/user/user.domain.module';
import { Module } from '@nestjs/common';
import { ReminderDomainModule } from '../../domain/reminder/reminder.domain.module';
import { RemindersApplicationService } from './reminders.application.service';

@Module({
  imports: [UserDomainModule, ReminderDomainModule],
  providers: [RemindersApplicationService],
  exports: [RemindersApplicationService],
})
export class RemindersApplicationModule {}
