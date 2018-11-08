import { INestjsBffConfigEnv } from '@nestjs-bff/backend/config/nestjs.config.env.interface';

const _Env = process.env.NODE_ENV || 'dev';

const _EnvConfigs: {
  dev: INestjsBffConfigEnv;
  test: INestjsBffConfigEnv;
  prod: INestjsBffConfigEnv;
} = {
  dev: require('./env/nestjs-bff.config.dev').NestjsConfigEnv,
  test: require('./env/nestjs-bff.config.test').NestjsConfigEnv,
  prod: require('./env/nestjs-bff.config.prod').NestjsConfigEnv,
};

export const AppConfigEnv: INestjsBffConfigEnv = _EnvConfigs[_Env];
