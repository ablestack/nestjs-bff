import { LoggerSysService } from '@nestjs-bff/backend/shared/logging/logger.shared.service';
import { getLogger } from '@nestjs-bff/backend/shared/logging/logging.shared.module';
import { MigrationsSysService } from '@nestjs-bff/backend/shared/migrations/migrations.shared.service';
import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { AppConfig } from '../../../../config/app.config';
import { WebAppHttpModule } from './web-app.http.module';

async function bootstrap() {
  // GLOBAL CONFIGURATION
  // @ts-ignore: type specified in node.d.ts but compilation not always picking it up.  Ignore for now
  global.nestjs_bff = { AppConfig };
  const bffLogger: LoggerSysService = getLogger();

  // CREATE NESTJS APP
  const app = await NestFactory.create(WebAppHttpModule, { logger: bffLogger });

  seedData(app, bffLogger);
  setupWebserver(app);

  // Start listening
  bffLogger.debug(`Nest-BFF: Starting to listen on port ${AppConfig.http.bffPort}`);
  await app.listen(AppConfig.http.bffPort);
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

function seedData(app: INestApplication, bffLogger: LoggerSysService) {
  try {
    bffLogger.info(`About to run migrations for group: ${AppConfig.nodeEnv}`);
    const migrationService: MigrationsSysService = app.get(MigrationsSysService);
    migrationService.sync(AppConfig.nodeEnv);
    migrationService.runMigration(AppConfig.nodeEnv);
    bffLogger.info(`Ran migrations for group: ${AppConfig.nodeEnv}`);
  } catch (error) {
    bffLogger.error(error);
  }
}
