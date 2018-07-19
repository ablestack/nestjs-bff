import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose-fix';
import { ConfigService } from 'common/services/config.service';

const configService = new ConfigService();

export const databaseProviders = [
  {
    provide: 'MongooseConnectionToken',
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;

      if (configService.nodeEnv === 'test') {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.helper.setDbVersion('3.4.3');

        mockgoose.prepareStorage().then(async () => {
          await mongoose.connect(
            configService.mongoConnectionUri,
            { useMongoClient: true },
          );
        });
      } else {
        await mongoose.connect(
          configService.mongoConnectionUri,
          { useMongoClient: true },
        );
      }
      return mongoose;
    },
  },
];
