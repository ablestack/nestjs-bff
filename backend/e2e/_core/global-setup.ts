import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { setupAuth } from './global-setup-auth';
import { setupDB } from './global-setup-db';

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
