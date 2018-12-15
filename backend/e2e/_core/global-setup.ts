import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { AppConfig } from '../../src/config/app.config';
import { setupAuth } from './global-setup-auth';
import { setupDB } from './global-setup-db';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

// Setup
const logger = getLogger();

//
// Primary global setup function
//
export const globalSetup = async globalConfig => {
  logger.trace('-- Global Setup Start -- ', Date.now().toLocaleString());

  await setupDB();
  await setupAuth();

  logger.trace('-- Global Setup End -- ');
};
