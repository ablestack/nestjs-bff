import { DomainAccessPermissionsModule } from '@nestjs-bff/backend/lib/domain/access-permissions/access-permissions.module';
import { HttpCoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { DomainReminderModule } from '../../../../domain/reminder/reminder.module';
import { ReminderController } from './reminder.controller';

@Module({
  imports: [HttpCoreModule, DomainReminderModule, DomainAccessPermissionsModule],
  controllers: [ReminderController],
  providers: [],
  exports: [],
})
export class HttpReminderModule {}
