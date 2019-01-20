import { Module } from '@nestjs/common';
import { HttpReminderModule } from '../../src/app/host/http/domain-service-host/reminder/reminder.module';
import { HttpWebAppModule } from '../../src/app/host/http/web-app.module';

@Module({
  imports: [HttpWebAppModule, HttpReminderModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ReminderE2eModule {}
