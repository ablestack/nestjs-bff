import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../app/app.shared.constants';
import { AppSharedModule } from '../../app/app.shared.module';
import { MongoSharedProviderTokens } from './mongo.shared.constants';

const MongooseConnectionProvider = {
  provide: MongoSharedProviderTokens.Connections.Mongoose,
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
  inject: [AppSharedProviderTokens.Config.App],
};

@Module({
  imports: [AppSharedModule],
  providers: [MongooseConnectionProvider],
  exports: [MongooseConnectionProvider],
})
export class MongoSharedModule {}
