import { INestjsBffConfigEnv } from '@nestjs-bff/backend/config/nestjs.config.env.interface';

const _Env = process.env.NODE_ENV || 'dev';

const _EnvConfigs: {
  dev: INestjsBffConfigEnv;
  test: INestjsBffConfigEnv;
  prod: INestjsBffConfigEnv;
} = {
  dev: require('./env/nestjs-bff.config.dev').AppConfigEnv,
  test: require('./env/nestjs-bff.config.test').AppConfigEnv,
  prod: require('./env/nestjs-bff.config.prod').AppConfigEnv,
};

export const AppConfigEnv: INestjsBffConfigEnv = _EnvConfigs[_Env];

export const keyFiles = {
  jwt: {
    private: `${process.cwd()}\\src\\config\\keys\\jwt.private-key.${_Env}.pem`,
    public: `${process.cwd()}\\src\\config\\keys\\jwt.public-key.${_Env}.pem`,
  },
};
