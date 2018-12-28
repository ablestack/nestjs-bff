import { Module } from '@nestjs/common';
import { AppSharedModule } from '../../shared/app/app.shared.module';
import { CachingSharedModule } from '../../shared/caching/caching.shared.module';
import { MongoSharedModule } from '../../shared/database/mongo/mongo.shared.module';
import { LoggingSharedModule } from '../../shared/logging/logging.shared.module';

@Module({
  imports: [AppSharedModule, MongoSharedModule, LoggingSharedModule, CachingSharedModule],
  providers: [],
  exports: [AppSharedModule, MongoSharedModule, LoggingSharedModule, CachingSharedModule],
})
export class CoreModule {}
