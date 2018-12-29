import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { DomainCoreModule } from '../core/core.module';
import { UserSchema } from './model/user.schema';
import { UserRepo } from './repo/user.repo';
import { UserProviderTokens } from './user.constants';

const UserModel = {
  provide: UserProviderTokens.Models.User,
  useFactory: mongoose => mongoose.connection.model('User', UserSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [DomainCoreModule],
  controllers: [],
  providers: [UserRepo, UserModel],
  exports: [UserRepo],
})
export class DomainUserModule {}
