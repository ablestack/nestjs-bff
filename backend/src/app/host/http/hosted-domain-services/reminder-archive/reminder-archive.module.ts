import { DomainAccessPermissionsModule } from '@nestjs-bff/backend/lib/domain/access-permissions/access-permissions.module';
import { HttpCoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { Module } from '@nestjs/common';
import { DomainReminderArchiveModule } from '../../../../domain/reminder-archive/reminder-archive.module';
import { ReminderArchiveController } from './reminder-archive.controller';

@Module({
  imports: [HttpCoreModule, DomainReminderArchiveModule, DomainAccessPermissionsModule],
  controllers: [ReminderArchiveController],
  providers: [],
  exports: [],
})
export class HttpReminderArchiveModule {}
