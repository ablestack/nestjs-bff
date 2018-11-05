import { NestjsBffConfig } from '@nestjs-bff/backend/config/nestjs-bff.config';
import { INestjsBffConfigEnv } from '@nestjs-bff/backend/config/nestjs.config.env.interface';
import * as _ from 'lodash';
import { AppConfigEnv } from './app.config.env';
import { NestBffConfigOverrides } from './nest-bff-overrides.config';

// Custom application configuration
export const _AppConfig = {
  caching: {
    entities: {
      cat: 60 * 20,
    },
  },
};

// Merge configs and export
export type IAppConfig = INestjsBffConfigEnv & typeof NestjsBffConfig & typeof _AppConfig;
export const AppConfig: IAppConfig = _.merge(_AppConfig, NestBffConfigOverrides, NestjsBffConfig, AppConfigEnv);
