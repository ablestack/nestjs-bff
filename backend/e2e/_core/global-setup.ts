import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { AppConfig } from '../../src/config/app.config';
import { setupTestDataLiterals } from '../shared/test-object-literals.constants';
import { setupAuth } from './global-setup-auth';
import { setupDB } from './global-setup-db';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

//
// Primary global setup function
//
export const globalSetup = async globalConfig => {
  // Setup
  const logger = getLogger();

  logger.trace('Global Setup Start', Date.now().toLocaleString());

  // catch and highlight any unhandled exceptions
  process
    .on('unhandledRejection', (reason, p) => {
      console.error(reason, '-------------------------------------- Unhandled Rejection at Promise!!!!!!!!!!!!', p);
    })
    .on('uncaughtException', err => {
      console.error(err, '----------------------------------------- Uncaught Exception thrown!!!!!!!!!!!!!!');
    });

  // setup DB
  await setupDB(globalConfig);

  // setup test data literals
  await setupTestDataLiterals();

  // add test users and auth
  await setupAuth(globalConfig);

  logger.trace('Global Setup End');
};
