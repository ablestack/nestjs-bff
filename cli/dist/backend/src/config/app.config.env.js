"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_exception_1 = require("@nestjs-bff/backend/lib/shared/exceptions/app.exception");
const _Env = process.env.NODE_ENV || 'dev';
let _AppConfigEnv;
switch (_Env) {
    case 'dev':
        _AppConfigEnv = require('./env/nestjs-bff.config.dev').NestjsConfigEnv;
        break;
    case 'test':
        _AppConfigEnv = require('./env/nestjs-bff.config.test').NestjsConfigEnv;
        break;
    case 'prod':
        _AppConfigEnv = require('./env/nestjs-bff.config.prod').NestjsConfigEnv;
        break;
    default:
        throw new app_exception_1.AppError('Env config could not be found for environment', { _Env });
}
exports.AppConfigEnv = _AppConfigEnv;
//# sourceMappingURL=app.config.env.js.map