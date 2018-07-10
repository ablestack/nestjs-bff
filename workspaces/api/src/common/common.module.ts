import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { WinstonLoggerService } from './services/winstonlogger.service';
import { LoggerService } from './services/logger.service';

const loggerServiceProvider = {
  provide: LoggerService,
  useClass: WinstonLoggerService,
};

@Module({
  providers: [ConfigService, loggerServiceProvider],
  exports: [ConfigService, loggerServiceProvider],
})
export class CommonModule {}
