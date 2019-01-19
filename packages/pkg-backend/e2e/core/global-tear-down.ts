import { INestjsBffConfig, NestjsBffConfig } from '../../lib/config/nestjs-bff.config';
import { getLogger } from '../../src/shared/logging/logging.shared.module';

export const globalTearDown = async (globalConfig: any, nestJsBffConfig?: INestjsBffConfig) => {
  // Setup
  nestJsBffConfig = nestJsBffConfig || NestjsBffConfig;
  const logger = getLogger();

  logger.trace('-- Global TearDown Start -- ');

  // No teardown currently configured. The TestDB resets in the global setup

  logger.trace('-- Global TearDown End -- ');
};
