import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { MongoSysProviderTokens } from '../database/mongo/mongo.shared.constants';
import { MongoSysModule } from '../database/mongo/mongo.shared.module';
import { LoggingSysModule } from '../logging/logging.shared.module';
import { MigrationsProviderTokens } from './migrations.shared.constants';
import { MigrationsSysService } from './migrations.shared.service';
import { MigrationSchema } from './schemas/migration.schema';

const MigrationModelProvider = {
  provide: MigrationsProviderTokens.Models.Migration,
  useFactory: (mongoose: Mongoose) =>
    mongoose.connection.model('Migration', MigrationSchema),
  inject: [MongoSysProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [MongoSysModule, LoggingSysModule],
  providers: [MigrationsSysService, MigrationModelProvider],
  exports: [MigrationsSysService],
})
export class MigrationsSysModule {}
