import { LoggerService } from './logger.service';
import { ConfigService } from './config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsoleLoggerService implements LoggerService {
  constructor(private readonly configService: ConfigService) {}

  public log(msg: string, ...logObjects: any[]): void {
    console.log(msg, ...logObjects);
  }

  public info(msg: string, ...logObjects: any[]): void {
    console.log(msg, ...logObjects);
  }

  public error(msg: string, ...logObjects: any[]): void {
    console.log(msg, ...logObjects);
  }

  public warn(msg: string, ...logObjects: any[]): void {
    console.log(msg, ...logObjects);
  }

  public debug(msg: string, ...logObjects: any[]): void {
    console.debug(msg, ...logObjects);
  }

  public trace(msg: string, ...logObjects: any[]): void {
    console.log(msg, ...logObjects);
  }
}
