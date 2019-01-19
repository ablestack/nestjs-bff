import { INestApplication, INestExpressApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { INestjsBffConfig } from '../../config/nestjs-bff.config';
import { LoggerSharedService } from '../../shared/logging/logger.shared.service';
import { MigrationsSharedService } from '../../shared/migrations/migrations.shared.service';

export class WebAppHelper {
  public static async setupNestjsBffApp(nestBffConfig: INestjsBffConfig, logger: LoggerSharedService, app: INestApplication & INestExpressApplication) {
    // RUN SETUP STEPS
    logger.debug(`AppConfig.migrations.autoRun: ${nestBffConfig.migrations.autoRun}`);
    if (nestBffConfig.migrations.autoRun) await app.get(MigrationsSharedService).autoRunMigrations(nestBffConfig.nodeEnv);
    this.setupExpressWebserver(app);
  }

  public static setupExpressWebserver(app: INestApplication & INestExpressApplication) {
    // Express Style Middleware
    app.use(cookieParser()); // attaches cookies to request object
    app.use(helmet()); // applies security hardening settings. using defaults: https://www.npmjs.com/package/helmet

    // Other Settings
    // TODO: app.enableCors(); // not sure if this is needed yet
  }
}
