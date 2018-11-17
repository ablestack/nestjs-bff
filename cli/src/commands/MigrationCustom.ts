import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { MigrationsService } from '@nestjs-bff/backend/migrations/migrations.service';
import { NestjsBffAppContainer } from '../NestjsBffAppContainer';
import { LoggerService } from '../../../backend/src/common/services/logger.service';

export let loggerService: LoggerService; // This needs to be initialized by the commandLoader
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
    const migrationService = NestjsBffAppContainer.appInstance.get(MigrationsService);
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
