#!/usr/bin/env node

import * as yargs from 'yargs';
import { LoggerService } from '../../api/src/common/services/logger.service';
import { WinstonLoggerService } from '../../api/src/common/services/winstonlogger.service';
import { ConfigService } from '../../api/src/common/services/config.service';

// global setup
const configService = new ConfigService();
configService.appName = 'nestjs-bff-cli';
const loggerService: LoggerService = new WinstonLoggerService(configService);

// prettier-ignore
// tslint:disable-next-line:no-unused-expression
yargs
  .env('FAMCLI')
  .commandDir('commands', {
    extensions: configService.nodeEnv === 'development' ? ['js', 'ts'] : ['js'],
    visit: (commandObject) => {
      commandObject.loggerService = loggerService;
      return commandObject;
    },
  })
  .demandCommand(1)
  .help()
  .version()
  .argv;
