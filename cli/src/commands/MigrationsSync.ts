import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { MigrationsSharedService } from '@nestjs-bff/backend/lib/shared/migrations/migrations.shared.service';
import { NestjsBffAppContainer } from '../nestjsBffAppContainer';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';

export let loggerService: LoggerSharedService; // This needs to be initialized by the commandLoader
export interface IParams {}

// Supply exports to satisfy Yargs command pattern: command, desc, builder, and handler
export const command = 'migrations-sync';
export const desc = 'Imports any migrations that are on the file system but missing in the database.';
export const builder: { [key: string]: yargs.Options } = {};
export async function handler(argv: any) {
  await NestjsBffAppContainer.ensureInitialized().then(() => {
    const migrationService = NestjsBffAppContainer.appInstance.get(MigrationsSharedService);
    migrationService.sync('', true).then(() => {
      process.exit(0);
    });
  });
}
