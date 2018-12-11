import { NestjsBffConfig } from '@nestjs-bff/backend/lib/config/nestjs-bff.config';
import { INestjsBffConfigEnv } from '@nestjs-bff/backend/lib/config/nestjs.config.env.interface';
import * as _ from 'lodash';
import { AppConfigEnv } from './app.config.env';
import { NestBffConfigOverrides } from './nest-bff-overrides.config';

// Custom application configuration
export const _AppConfig = {
  caching: {
    entities: {
      todo: 60 * 20,
    },
  },
};

// Merge configs and export
export type IAppConfig = INestjsBffConfigEnv & typeof NestjsBffConfig & typeof _AppConfig;
export const AppConfig: IAppConfig = _.merge(NestjsBffConfig, NestBffConfigOverrides, _AppConfig, AppConfigEnv);
