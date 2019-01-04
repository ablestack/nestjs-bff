import { Inject, Injectable } from '@nestjs/common';
import * as FileSystem from 'fs';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { INestjsBffConfig } from '../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../app/app.shared.constants';
import { LoggerSharedService } from './logger.shared.service';

@Injectable()
export class LoggerWinstonSharedService implements LoggerSharedService {
  public static loggerInstance: LoggerSharedService;
  private static readonly TRANSPORT_KEY_CONSOLE: string = 'console';
  private static readonly TRANSPORT_KEY_FILE: string = 'file';

  private readonly appName: string;
  private logger: winston.Logger;
  private transports: Transport[] = [];

  constructor(
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
  ) {
    this.appName = nestjsBffConfig.appName;

    const logLevel: string = this.nestjsBffConfig.logging.winston.level;
    const logTransport: object = this.nestjsBffConfig.logging.winston.transports;

    for (const key in logTransport) {
      if (logTransport.hasOwnProperty(key)) {
        if (key === LoggerWinstonSharedService.TRANSPORT_KEY_CONSOLE) {
          this.configureConsoleTransport(logTransport[key], logLevel);
        } else if (key === LoggerWinstonSharedService.TRANSPORT_KEY_FILE) {
          this.configureFileTransport(logTransport[key]);
        }
      }
    }
    this.logger = winston.createLogger({
      transports: this.transports,
    });
  }

  public log(msg: string, ...logObjects: any[]): void {
    this.info(msg, ...logObjects);
  }

  public info(msg: string, ...logObjects: any[]): void {
    this.logger.info(msg, ...logObjects);
  }

  public error(msg: string, ...logObjects: any[]): void {
    this.logger.error(msg, ...logObjects);
  }

  public warn(msg: string, ...logObjects: any[]): void {
    this.logger.warn(msg, ...logObjects);
  }

  public debug(msg: string, ...logObjects: any[]): void {
    this.logger.debug(msg, ...logObjects);
  }

  public trace(msg: string, ...logObjects: any[]): void {
    this.logger.verbose(msg, ...logObjects);
  }

  /**
   * Configuring console transport
   */
  private configureConsoleTransport(transport: object, logLevel: string): void {
    const options: object = Object.assign(
      {
        level: logLevel,
      },
      transport,
    );
    this.transports.push(new winston.transports.Console(options));
  }

  /**
   * Configuring file transport
   */
  private configureFileTransport(transport: object): void {
    const targetFileList: object = this.nestjsBffConfig.logging.winston.target;

    // Creating log directory if it does not exist
    if (!FileSystem.existsSync(this.nestjsBffConfig.logging.logDir)) {
      FileSystem.mkdirSync(this.nestjsBffConfig.logging.logDir);
    }

    for (const key in targetFileList) {
      if (targetFileList.hasOwnProperty(key)) {
        const options: object = Object.assign(
          {
            name: key,
            level: key,
            filename: `${this.nestjsBffConfig.logging.logDir}/${this.appName + '-' + targetFileList[key]}`,
          },
          transport,
        );
        this.transports.push(new winston.transports.File(options));
      }
    }
  }
}
