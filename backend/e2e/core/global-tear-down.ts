import { globalTearDown as pkgBackendGlobalTearDown } from '@nestjs-bff/backend/lib-e2e/core/global-tear-down';
import { AppConfig } from '../../src/config/app.config';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

//
// Primary global setup function
//
export const globalTearDown = async globalConfig => {
  await pkgBackendGlobalTearDown(globalConfig);
};
