import { globalSetupBase } from '@nestjs-bff/backend/lib-e2e/core/global-setup-base';
import { AppConfig } from '../../src/config/app.config';

//
// Primary global setup function
//
export const globalSetup = async globalConfig => {
  await globalSetupBase(globalConfig, AppConfig);
};
