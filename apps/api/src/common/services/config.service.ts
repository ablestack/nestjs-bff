import { Injectable } from '@nestjs/common';
import * as loggerConfig from '../../../config/logging.config';
import * as appConfig from '../../../config/app.config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import * as path from 'path';

const dotenvRelativePath = '../../../config/.env';
type NodeEnvType = 'development' | 'test' | 'production';
const validNodeEnvConfigStrings = ['development', 'test', 'production'];

export interface EnvConfig {
  [prop: string]: string;
}

@Injectable()
export class ConfigService {
  public readonly loggerConfig = loggerConfig.config;
  public readonly appConfig = appConfig.config;

  public get appName(): string {
    return this.envConfig.APPNAME;
  }
  public set appName(appName: string) {
    this.envConfig.APPNAME = appName;
  }

  public get jwtSecretKey(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }

  public get nodeEnv(): NodeEnvType {
    return this.envConfig.NODE_ENV as NodeEnvType;
  }

  public set nodeEnv(nodeEnv: NodeEnvType) {
    this.envConfig.NODE_ENV = this.nodeEnv;
  }

  get mongoConnectionUri(): string {
    return this.envConfig.MONGO_CONNECTION_URI;
  }

  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenv.parse(fs.readFileSync(path.resolve(__dirname, dotenvRelativePath)));
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().valid(validNodeEnvConfigStrings),
      MONGO_CONNECTION_URI: Joi.string(),
      JWT_SECRET_KEY: Joi.string(),
      APPNAME: Joi.string(),
      BFFCLI_MIGRATE_DBURI: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
