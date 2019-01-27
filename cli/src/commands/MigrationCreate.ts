import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { MigrationsSharedService } from '@nestjs-bff/backend/lib/shared/migrations/migrations.shared.service';
import { NestjsBffAppContainer } from '../nestjsBffAppContainer';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';

export let loggerService: LoggerSharedService; // This needs to be initialized by the commandLoader
export interface IParams {
  migrationName: string;
}

// Supply exports to satisfy Yargs command pattern: command, desc, builder, and handler
export const command = 'migration-create <migration-name>';
export const desc = `Creates a new migration file`;
export const builder: { [key: string]: yargs.Options } = {
  migrationName: { type: 'string', required: true, description: 'migration name' },
};
export async function handler({ migrationName }: IParams) {
  await NestjsBffAppContainer.ensureInitialized().then(() => {
    const migrationService = NestjsBffAppContainer.appInstance.get(MigrationsSharedService);
    migrationService.create('', migrationName).then(() => {
      process.exit(0);
    });
  });
}
