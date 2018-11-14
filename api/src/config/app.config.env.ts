import { INestjsBffConfigEnv } from '@nestjs-bff/backend/config/nestjs.config.env.interface';
import { AppError } from '@nestjs-bff/backend/shared/exceptions/app.exception';

const _Env = process.env.NODE_ENV || 'dev';

let _AppConfigEnv: INestjsBffConfigEnv;

//
// Dynamically load correct env file
//
switch (_Env) {
  case 'dev':
    // tslint:disable-next-line:no-var-requires
    _AppConfigEnv = require('./env/nestjs-bff.config.dev').NestjsConfigEnv;
    break;
  case 'test':
    // tslint:disable-next-line:no-var-requires
    _AppConfigEnv = require('./env/nestjs-bff.config.test').NestjsConfigEnv;
    break;
  case 'prod':
    // tslint:disable-next-line:no-var-requires
    _AppConfigEnv = require('./env/nestjs-bff.config.prod').NestjsConfigEnv;
    break;
  default:
    throw new AppError('Env config could not be found for environment', { _Env });
}

export const AppConfigEnv: INestjsBffConfigEnv = _AppConfigEnv;
