import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import { LoggerService } from '../../../backend/src/common/services/logger.service';
import { ConsoleLoggerService } from '../../../backend/src/common/services/consolelogger.service';

export let loggerService: LoggerService = null; // This needs to be initialized by the commandLoader

async function askName(): Promise<string> {
  loggerService.log(':wave:  Hello stranger!');
  const { name } = await ask<IParams>([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
    },
  ]);
  return name;
}

export interface IParams {
  name?: string;
}

// Supply exports to satisfy Yargs command pattern: command, desc, builder, and handler
export const command = 'hello';
export const desc = `Let's get to know each other`;
export const builder: { [key: string]: yargs.Options } = {
  name: { type: 'string', required: false, description: 'your name' },
};
export async function handler({ name }: IParams) {
  loggerService.log(`Oh, nice to meet you, ${name || (await askName())}!`);
}
