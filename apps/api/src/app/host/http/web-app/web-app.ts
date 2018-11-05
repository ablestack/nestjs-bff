import { getLogger } from '@nestjs-bff/backend/shared/logging/logging.shared.module';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from 'config/app.config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { WebAppHttpModule } from './web-app.http.module';

async function bootstrap() {
  const bffLogger = getLogger();
  const app = await NestFactory.create(WebAppHttpModule, { logger: bffLogger });

  // GLOBAL CONFIGURATION
  global.nestjs_bff = { AppConfig };

  // Express Style Middleware
  app.use(cookieParser()); // attaches cookies to request object
  app.use(helmet()); // applies security hardening settings. using defaults: https://www.npmjs.com/package/helmet

  // Other Settings
  // TODO: app.enableCors(); // not sure if this is needed yet

  // Start listening
  bffLogger.debug(`Nest-BFF: Starting to listen on port ${AppConfig.http.bffPort}`);
  await app.listen(AppConfig.http.bffPort);
}
bootstrap();
