import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { MigrationsService } from '../../../backend/src/migrations/migrations.service';
import { NestjsBffAppContainer } from '../NestjsBffAppContainer';
import { LoggerService } from '../../../backend/src/common/services/logger.service';

export let loggerService: LoggerService; // This needs to be initialized by the commandLoader
export interface IParams {
  migrationName: string;
}

// Supply exports to satisfy Yargs command pattern: command, desc, builder, and handler
export const command = 'migration-down';
export const desc = `Runs the "DOWN" script for all migrations up to and including the specified migration`;
export const builder: { [key: string]: yargs.Options } = {
  migrationName: { type: 'string', required: true, description: 'migration name' },
};
export async function handler({ migrationName }: IParams) {
  await NestjsBffAppContainer.ensureInitialized().then(() => {
    const migrationService = NestjsBffAppContainer.appInstance.get(MigrationsService);
    migrationService
      .runMigration('down', migrationName)
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(0);
      });
  });
}
