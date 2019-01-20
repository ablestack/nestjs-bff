import { HttpWebAppBaseModule } from '@nestjs-bff/backend/lib/host/http/web-app-base.module';
import { Module } from '@nestjs/common';
import { HttpReminderArchiveModule } from './domain-service-host/reminder-archive/reminder-archive.module';
import { HttpReminderModule } from './domain-service-host/reminder/reminder.module';

@Module({
  imports: [HttpWebAppBaseModule, HttpReminderModule, HttpReminderArchiveModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class HttpWebAppModule {}
