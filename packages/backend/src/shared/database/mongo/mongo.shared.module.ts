import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSysProviderTokens } from '../../app/app.shared.constants';
import { AppSysModule } from '../../app/app.shared.module';
import { MongoSysProviderTokens } from './mongo.shared.constants';

const MongooseConnectionProvider = {
  provide: MongoSysProviderTokens.Connections.Mongoose,
  useFactory: async (
    nestjsBffConfig: INestjsBffConfig,
  ): Promise<typeof mongoose> => {
    const con = await mongoose.connect(
      nestjsBffConfig.db.mongo.mongoConnectionUri,
      nestjsBffConfig.db.mongo.options,
    );
    mongoose.set('debug', nestjsBffConfig.db.mongo.debugLogging);
    console.log({ con, debugLogging: nestjsBffConfig.db.mongo.debugLogging });
    return con;
  },
  inject: [AppSysProviderTokens.Config.App],
};

@Module({
  imports: [AppSysModule],
  providers: [MongooseConnectionProvider],
  exports: [MongooseConnectionProvider],
})
export class MongoSysModule {}
