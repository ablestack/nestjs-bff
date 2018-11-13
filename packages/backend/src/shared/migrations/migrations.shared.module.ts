import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { MongoSharedProviderTokens } from '../database/mongo/mongo.shared.constants';
import { MongoSharedModule } from '../database/mongo/mongo.shared.module';
import { LoggingSharedModule } from '../logging/logging.shared.module';
import { MigrationsProviderTokens } from './migrations.shared.constants';
import { MigrationsSharedService } from './migrations.shared.service';
import { MigrationSchema } from './schemas/migration.schema';

const MigrationModelProvider = {
  provide: MigrationsProviderTokens.Models.Migration,
  useFactory: (mongoose: Mongoose) =>
    mongoose.connection.model('Migration', MigrationSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [MongoSharedModule, LoggingSharedModule],
  providers: [MigrationsSharedService, MigrationModelProvider],
  exports: [MigrationsSharedService],
})
export class MigrationsSharedModule {}
