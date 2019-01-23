import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { INestjsBffConfig } from '../../config/nestjs-bff.config';
import { LoggerSharedService } from '../../shared/logging/logger.shared.service';
import { MigrationsSharedService } from '../../shared/migrations/migrations.shared.service';

export class WebAppHelper {
  public static async setupNestjsBffApp(
    nestBffConfig: INestjsBffConfig,
    logger: LoggerSharedService,
    app: INestApplication & INestExpressApplication,
  ) {
    // RUN SETUP STEPS
    logger.debug(`AppConfig.migrations.autoRun: ${nestBffConfig.migrations.autoRun}`);
    if (nestBffConfig.migrations.autoRun) await app.get(MigrationsSharedService).autoRunMigrations(nestBffConfig.nodeEnv);
  }
}
