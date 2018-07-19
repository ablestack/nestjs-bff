import { WinstonLoggerService } from './services/winstonlogger.service';
import { LoggerService } from './services/logger.service';

export const loggerServiceProvider = {
  provide: LoggerService,
  useClass: WinstonLoggerService,
};
