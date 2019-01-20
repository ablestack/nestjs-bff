import { globalTearDownBase } from '@nestjs-bff/backend/lib-e2e/core/global-tear-down-base';
import { AppConfig } from '../../src/config/app.config';

//
// Primary global setup function
//
export const globalTearDown = async globalConfig => {
  await globalTearDownBase(globalConfig, AppConfig);
};
