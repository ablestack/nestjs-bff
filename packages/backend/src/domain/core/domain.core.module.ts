import { Module } from '@nestjs/common';
import { AppSysModule } from '../../shared/app/app.shared.module';
import { CachingSysModule } from '../../shared/caching/caching.shared.module';
import { MongoSysModule } from '../../shared/database/mongo/mongo.shared.module';
import { LoggingSysModule } from '../../shared/logging/logging.shared.module';

@Module({
  imports: [AppSysModule, MongoSysModule, LoggingSysModule, CachingSysModule],
  providers: [],
  exports: [AppSysModule, MongoSysModule, LoggingSysModule, CachingSysModule],
})
export class CoreDomainModule {}
