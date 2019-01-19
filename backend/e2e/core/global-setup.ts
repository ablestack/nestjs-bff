import { globalSetup as pkgBackendGlobalSetup } from '@nestjs-bff/backend/lib-e2e/core/global-setup';
import { AppConfig } from '../../src/config/app.config';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

//
// Primary global setup function
//
export const globalSetup = async globalConfig => {
  await pkgBackendGlobalSetup(globalConfig);
};
