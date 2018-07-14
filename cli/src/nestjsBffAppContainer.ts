
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CliAppModule } from '../../../src/cliapp.module';

export class  NestjsBffAppContainer {
    public static appInstance: INestApplication;

    public static async ensureInitialized(): Promise<void> {
        if (!NestjsBffAppContainer.appInstance) await NestFactory.create(CliAppModule).then((nestApp: INestApplication) => { this.appInstance = nestApp; });
    }
}