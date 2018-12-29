import * as _ from 'lodash';
import { LogLevels } from '../shared/logging/log-levels.const';
import { INestjsBffConfigEnv } from './nestjs.config.env.interface';
import { NestjsBffConfigEnv } from './nestjs.config.test';

const _Env = process.env.NODE_ENV || 'dev';

export const keyFiles = {
  jwt: {
    private: `${process.cwd()}\\src\\config\\keys\\jwt.private-key.${_Env}.pem`,
    public: `${process.cwd()}\\src\\config\\keys\\jwt.public-key.${_Env}.pem`,
  },
};

const _NestjsBffConfig = {
  orgName: 'my-org',
  appName: 'my-app',
  rootPath: process.cwd(),

  caching: {
    entities: {
      organization: 60 * 20,
      user: 60 * 20,
    },
  },

  migrations: {
    autoRun: false,
  },

  db: {
    mongo: {
      debugLogging: false,
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500,
        poolSize: 10,
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      },
    },
  },

  http: {
    publicRouteRegex: /public\//,
  },

  jwt: {
    jwtPrivateKey: '',
    jwtPrivateKeyPemPassphrase: 'D161tal',
    jwtPublicKey: '',
    issuer: 'entity',
    expiresIn: '18h',
    signingAlgorithm: 'RS256',
  },

  logging: {
    logDir: 'logs',
    console: {
      levels: [LogLevels.error, LogLevels.warning, LogLevels.info, LogLevels.debug, LogLevels.trace],
    },
    winston: {
      level: 'info',
      enableMiddleware: true,
      transports: {
        console: {
          colorize: true,
          timestamp: true,
          json: false,
          showLevel: true,
        },
        file: {
          json: true,
          maxsize: 10485760,
          maxfile: 5,
        },
      },
      target: {
        trace: 'trace.log',
        debug: 'debug.log',
        error: 'error.log',
        warn: 'info.log',
        info: 'info.log',
      },
    },
  },

  social: {
    facebook: {
      authorizeHost: 'https://facebook.com',
      tokenHost: 'https://graph.facebook.com/v3.1',
      apiHost: 'https://graph.facebook.com/v3.1',
      authorizePath: '/dialog/oauth',
      authorizeScope: ['email'], // For requesting permissions from Facebook API.  ID and Name are default
      tokenPath: '/oauth/access_token',
      apiProfilePath: '/me',
      callbackRelativeURL_signIn: '/auth/facebook/sign-in',
      callbackRelativeURL_signUp: '/auth/facebook/sign-up',
    },
  },
};

export type INestjsBffConfig = typeof _NestjsBffConfig & INestjsBffConfigEnv;
export const NestjsBffConfig: INestjsBffConfig = _.merge(_NestjsBffConfig, NestjsBffConfigEnv);
