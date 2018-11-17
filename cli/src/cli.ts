#!/usr/bin/env node

import * as yargs from 'yargs';
import { AppConfig } from '../../backend/src/config/app.config';
import { getLogger } from '@nestjs-bff/backend/shared/logging/logging.shared.module';

// global setup
AppConfig.appName = 'nestjs-bff-cli';
AppConfig.jwt;

global.nestjs_bff = { AppConfig };
const bffLogger = getLogger();

// prettier-ignore
// tslint:disable-next-line:no-unused-expression
yargs
  .env('BFFCLI')
  .commandDir('commands', {
    extensions: AppConfig.nodeEnv === 'dev' ? ['js', 'ts'] : ['js'],
    visit: (commandObject) => {
      commandObject.loggerService = bffLogger;
      return commandObject;
    },
  })
  .demandCommand(1)
  .help()
  .version()
  .argv;
