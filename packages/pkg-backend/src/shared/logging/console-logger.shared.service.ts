import { Inject } from '@nestjs/common';
import { INestjsBffConfig } from '../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../app/app.shared.constants';
import { LogLevels } from './log-levels.const';
import { LoggerSharedService } from './logger.shared.service';

export class LoggerConsoleSharedService implements LoggerSharedService {
  constructor(
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
  ) {}
  private startSeparator = '\n';
  private endSeparator = '\n\n---------------';

  private logError: boolean = this.nestjsBffConfig.logging.console.levels.includes(LogLevels.error);
  private logWarn: boolean = this.nestjsBffConfig.logging.console.levels.includes(LogLevels.warning);
  private logInfo: boolean = this.nestjsBffConfig.logging.console.levels.includes(LogLevels.info);
  private logDebug: boolean = this.nestjsBffConfig.logging.console.levels.includes(LogLevels.debug);
  private logTrace: boolean = this.nestjsBffConfig.logging.console.levels.includes(LogLevels.trace);

  public async log(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logInfo) console.log(this.startSeparator, msg, ...logObjects, this.endSeparator);
    // tslint:disable-next-line:no-console
    // console.trace();
  }

  public async info(msg: string, ...logObjects: any[]) {
    if (this.logInfo) {
      // tslint:disable-next-line:no-console
      console.info(this.startSeparator, msg, ...logObjects, this.endSeparator);
    }
  }

  public async error(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logError) {
      console.error(this.startSeparator, msg, ...logObjects, this.endSeparator);
      // tslint:disable-next-line:no-console
      console.trace();
    }
  }

  public async warn(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logWarn) console.warn(this.startSeparator, msg, ...logObjects, this.endSeparator);
  }

  public async debug(msg: string, ...logObjects: any[]) {
    if (this.logDebug) {
      // tslint:disable-next-line:no-console
      console.debug(this.startSeparator, msg, ...logObjects, this.endSeparator);
    }
    // tslint:disable-next-line:no-console
    // console.trace();
  }

  public async trace(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logTrace) console.log(this.startSeparator, msg, ...logObjects, this.endSeparator);
  }
}
