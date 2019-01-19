import { HttpWebAppModule as PkgBackendHttpWebAppModule } from '@nestjs-bff/backend/lib/host/http/web-app.module';
import { Module } from '@nestjs/common';
import { HttpReminderArchiveModule } from './domain-service-host/reminder-archive/reminder-archive.module';
import { HttpReminderModule } from './domain-service-host/reminder/reminder.module';

@Module({
  imports: [PkgBackendHttpWebAppModule, HttpReminderModule, HttpReminderArchiveModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class HttpWebAppModule {}
