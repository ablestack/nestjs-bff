import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { MigrationsSharedService } from '@nestjs-bff/backend/lib/shared/migrations/migrations.shared.service';
import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { AppConfig } from '../../../../config/app.config';
import { WebAppModule } from './web-app.module';

async function bootstrap() {
  // GLOBAL CONFIGURATION
  // @ts-ignore: type specified in node.d.ts but compilation not always picking it up.  Ignore for now
  global.nestjs_bff = { AppConfig };
  const bffLogger: LoggerSharedService = getLogger();

  //
  bffLogger.debug(`starting web-app bootstrap`);

  // CREATE NESTJS APP
  const app = await NestFactory.create(WebAppModule, { logger: bffLogger });

  // RUN SETUP STEPS
  bffLogger.debug(`AppConfig.migrations.autoRun: ${AppConfig.migrations.autoRun}`);
  if (AppConfig.migrations.autoRun) await app.get(MigrationsSharedService).autoRunMigrations(AppConfig.nodeEnv);
  setupWebserver(app);

  // START LISTENING
  bffLogger.debug(`Nest-BFF: Starting to listen on port ${AppConfig.bffPort}`);
  await app.listen(AppConfig.bffPort);
}
bootstrap();

/**
 *
 * @param app
 */
function setupWebserver(app: INestApplication & INestExpressApplication) {
  // Express Style Middleware
  app.use(cookieParser()); // attaches cookies to request object
  app.use(helmet()); // applies security hardening settings. using defaults: https://www.npmjs.com/package/helmet

  // Other Settings
  // TODO: app.enableCors(); // not sure if this is needed yet
}
