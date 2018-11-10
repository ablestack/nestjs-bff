import { LogLevels } from '@nestjs-bff/backend/shared/logging/log-levels.const';
import { extractKey } from '@nestjs-bff/backend/shared/utils/key.shared.utils';

export const NestBffConfigOverrides = {
  rootPath: process.cwd(),

  caching: {
    entities: {
      organization: 60 * 20,
      user: 60 * 20,
    },
  },

  migrations: {
    autoRun: true,
  },

  db: {
    mongo: {
      debugLogging: true,
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
    jwtPrivateKey: extractKey(`${process.cwd()}\\src\\config\\keys\\jwt.private-key.pem`),
    jwtPrivateKeyPemPassphrase: 'D161tal',
    jwtPublicKey: extractKey(`${process.cwd()}\\src\\config\\keys\\jwt.public-key.pem`),
    issuer: 'my org name',
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
