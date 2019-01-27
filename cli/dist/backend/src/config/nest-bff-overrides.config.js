"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_levels_const_1 = require("@nestjs-bff/backend/lib/shared/logging/log-levels.const");
exports.NestBffConfigOverrides = {
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
        jwtPrivateKeyPemPassphrase: 'D161tal',
        issuer: 'my org name',
        expiresIn: '18h',
        signingAlgorithm: 'RS256',
    },
    logging: {
        logDir: 'logs',
        console: {
            levels: [log_levels_const_1.LogLevels.error, log_levels_const_1.LogLevels.warning, log_levels_const_1.LogLevels.info, log_levels_const_1.LogLevels.debug, log_levels_const_1.LogLevels.trace],
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
            authorizeScope: ['email'],
            tokenPath: '/oauth/access_token',
            apiProfilePath: '/me',
            callbackRelativeURL_signIn: '/auth/facebook/sign-in',
            callbackRelativeURL_signUp: '/auth/facebook/sign-up',
        },
    },
};
//# sourceMappingURL=nest-bff-overrides.config.js.map