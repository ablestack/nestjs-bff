import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';

export const globalTearDown = async globalConfig => {
  const logger = getLogger();

  logger.trace('-- Global TearDown Start -- ');

  // No teardown currently configured. The TestDB resets in the global setup

  logger.trace('-- Global TearDown End -- ');
};
