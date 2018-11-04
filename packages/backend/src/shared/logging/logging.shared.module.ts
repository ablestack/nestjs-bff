import { Module } from '@nestjs/common';
import { NestjsBffConfig } from '../../config/nestjs-bff.config';
import { LoggerConsoleSysService } from './console-logger.shared.service';
import { LoggerWinstonSysService } from './logger-winston.shared.service';
import { LoggerSysService } from './logger.shared.service';

export const getLogger = (): LoggerSysService => {
  return NestjsBffConfig.nodeEnv === 'prod'
    ? new LoggerWinstonSysService(NestjsBffConfig)
    : new LoggerConsoleSysService(NestjsBffConfig);
};

const LoggerSysServiceProvider = {
  provide: LoggerSysService,
  useFactory: getLogger,
};

@Module({
  imports: [],
  providers: [LoggerSysServiceProvider],
  exports: [LoggerSysServiceProvider],
})
export class LoggingSysModule {}
