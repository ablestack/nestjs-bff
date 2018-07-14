import * as winston from 'winston';
import * as FileSystem from 'fs';
import { LoggerService } from './logger.service';
import { ConfigService } from './config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  public static loggerInstance: LoggerService;
  private static readonly TRANSPORT_KEY_CONSOLE: string = 'console';
  private static readonly TRANSPORT_KEY_FILE: string = 'file';

  private readonly appName: string;
  private logger: winston.LoggerInstance;
  private transports: winston.TransportInstance[] = [];

  constructor(private readonly configService: ConfigService) {
    this.appName = configService.appName;
    this.initialize();
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

  private initialize() {
    const logLevel: string = this.configService.loggerConfig.winston.level;
    const logTransport: object = this.configService.loggerConfig.winston.transports;

    for (const key in logTransport) {
      if (logTransport.hasOwnProperty(key)) {
        if (key === WinstonLoggerService.TRANSPORT_KEY_CONSOLE) {
          this.configureConsoleTransport(logTransport[key], logLevel);
        } else if (key === WinstonLoggerService.TRANSPORT_KEY_FILE) {
          this.configureFileTransport(logTransport[key]);
        }
      }
    }
    this.logger = new winston.Logger({
      transports: this.transports,
    });
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
    const targetFileList: object = this.configService.loggerConfig.winston.target;

    // Creating log directory if it does not exist
    if (!FileSystem.existsSync(this.configService.loggerConfig.logDir)) {
      FileSystem.mkdirSync(this.configService.loggerConfig.logDir);
    }

    for (const key in targetFileList) {
      if (targetFileList.hasOwnProperty(key)) {
        const options: object = Object.assign(
          {
            name: key,
            level: key,
            filename: `${this.configService.loggerConfig.logDir}/${this.appName + '-' + targetFileList[key]}`,
          },
          transport,
        );
        this.transports.push(new winston.transports.File(options));
      }
    }
  }
}
