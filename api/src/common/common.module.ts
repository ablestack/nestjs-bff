import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { WinstonLoggerService } from './services/winstonlogger.service';
import { LoggerService } from './services/logger.service';
import { DatabaseModule } from '../database/database.module';

const loggerServiceProvider = {
  provide: LoggerService,
  useClass: WinstonLoggerService,
};

@Module({
  providers: [DatabaseModule, ConfigService, loggerServiceProvider],
  exports: [DatabaseModule, ConfigService, loggerServiceProvider],
})
export class CommonModule {}
