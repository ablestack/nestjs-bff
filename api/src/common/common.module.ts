import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { DatabaseModule } from '../database/database.module';
import { loggerServiceProvider } from './loggerservice.provider';

@Module({
  providers: [DatabaseModule, ConfigService, loggerServiceProvider],
  exports: [DatabaseModule, ConfigService, loggerServiceProvider],
})
export class CommonModule {}
