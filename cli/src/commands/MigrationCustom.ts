import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { MigrationsSharedService } from '@nestjs-bff/backend/lib/shared/migrations/migrations.shared.service';
import { NestjsBffAppContainer } from '../nestjsBffAppContainer';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';

export let loggerService: LoggerSharedService; // This needs to be initialized by the commandLoader
export interface IParams {
  filename: string;
  direction: string;
}

// Supply exports to satisfy Yargs command pattern: command, desc, builder, and handler
export const command = 'migration-custom';
export const desc = `Runs a custom migration`;
export const builder: { [key: string]: yargs.Options } = {
  filename: { type: 'string', required: true, description: 'custom migration file' },
  direction: { type: 'string', required: true, description: 'the migration direction to run: up or down' },
};
export async function handler({ filename, direction }: IParams) {
  await NestjsBffAppContainer.ensureInitialized().then(() => {
    const migrationService = NestjsBffAppContainer.appInstance.get(MigrationsSharedService);
    migrationService
      .runCustomMigration(direction, filename)
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(0);
      });
  });
}
