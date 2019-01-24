import { NestjsBffConfig } from '../../src/config/nestjs-bff.config';
import { getLogger } from '../../src/shared/logging/logging.shared.module';
import { setupTestDataJwtTokens } from '../core/test-object.utils';
import { setupAuth } from './global-setup-auth';
import { setupDB } from './global-setup-db';
import { testData } from './test-object-literals.constants';

//
// Primary global setup function
//
export const globalSetupBase = async (globalConfig: any, nestJsBffConfig?: any) => {
  // Setup
  nestJsBffConfig = nestJsBffConfig || NestjsBffConfig;
  const logger = getLogger();
  logger.trace('Global Setup Start', Date.now().toString());
  // catch and highlight any unhandled exceptions
  process
    .on('unhandledRejection', (reason, p) => {
      console.error(reason, '-------------------------------------- Unhandled Rejection at Promise!!!!!!!!!!!!', p);
    })
    .on('uncaughtException', err => {
      console.error(err, '----------------------------------------- Uncaught Exception thrown!!!!!!!!!!!!!!');
    });
  // setup DB
  await setupDB(globalConfig, nestJsBffConfig);
  // setup test data literals
  await setupTestDataJwtTokens(nestJsBffConfig, testData);
  // add test users and auth
  await setupAuth(globalConfig, nestJsBffConfig);
  logger.trace('Global Setup End');
};
