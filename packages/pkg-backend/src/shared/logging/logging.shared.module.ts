import { Module } from '@nestjs/common';
import { NestjsBffConfig } from '../../config/nestjs-bff.config';
import { LoggerConsoleSharedService } from './console-logger.shared.service';
import { LoggerWinstonSharedService } from './logger-winston.shared.service';
import { LoggerSharedService } from './logger.shared.service';

export const getLogger = (): LoggerSharedService => {
  return NestjsBffConfig.nodeEnv === 'prod'
    ? new LoggerWinstonSharedService(NestjsBffConfig)
    : new LoggerConsoleSharedService(NestjsBffConfig);
};

const LoggerSharedServiceProvider = {
  provide: LoggerSharedService,
  useFactory: getLogger,
};

@Module({
  imports: [],
  providers: [LoggerSharedServiceProvider],
  exports: [LoggerSharedServiceProvider],
})
export class LoggingSharedModule {}
