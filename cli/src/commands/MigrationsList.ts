import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { LoggerService } from '../../../api/src/common/services/logger.service';
import { MigrationsService } from '../../../api/src/migrations/migrations.service';
import { NestjsBffAppContainer } from '../NestjsBffAppContainer';

export let loggerService: LoggerService; // This needs to be initialized by the commandLoader
export interface IParams {}

// Supply exports to satisfy Yargs command pattern: command, desc, builder, and handler
export const command = 'migrations-list';
export const desc = `Lists all migrations and their current state`;
export const builder: { [key: string]: yargs.Options } = {};
export async function handler(argv: any) {
  await NestjsBffAppContainer.ensureInitialized().then(() => {
    const migrationService = NestjsBffAppContainer.appInstance.get(MigrationsService);
    migrationService.list().then(() => {
      process.exit(0);
    });
  });
}
