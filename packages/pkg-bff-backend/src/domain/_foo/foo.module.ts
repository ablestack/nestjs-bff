import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { DomainCoreModule } from '../core/core.module';
import { FooProviderTokens } from './foo.constants';
import { FooSchema } from './model/foo.schema';
import { FooRepo } from './repo/foo.repo';

const FooModel = {
  provide: FooProviderTokens.Models.Foo,
  useFactory: mongoose => mongoose.connection.model('Foo', FooSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [DomainCoreModule],
  providers: [FooRepo, FooModel],
  exports: [FooRepo],
})
export class DomainFooModule {}
