import { WebAppHelper } from '@nestjs-bff/backend/lib/host/http/web-app-helper';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from '../../../config/app.config';
import { HttpWebAppModule } from './web-app.module';

declare const module: any;

// GLOBAL CONFIGURATION
// @ts-ignore: type specified in node.d.ts but compilation not always picking it up.  Ignore for now
global.nestjs_bff = { config: AppConfig };

async function bootstrap() {
  // CONFIGURATION
  const logger: LoggerSharedService = getLogger();

  // LOGGING
  logger.debug(`starting web-app bootstrap`);

  // CREATE NESTJS APP
  const app = await NestFactory.create(HttpWebAppModule, { logger });

  WebAppHelper.setupNestjsBffApp(AppConfig, logger, app);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // START LISTENING
  logger.debug(`Nest-BFF: Starting to listen on port ${AppConfig.http.bffPort}`);
  await app.listen(AppConfig.http.bffPort);
}
bootstrap();
