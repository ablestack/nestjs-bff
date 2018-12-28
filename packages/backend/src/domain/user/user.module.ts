import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { UserSchema } from './model/user.schema';
import { UserRepo } from './repo/user.repo';
import { UserRepoCache } from './repo/user.repo-cache';
import { UserRepoWrite } from './repo/user.repo-write';
import { UserProviderTokens } from './user.constants';

const UserModel = {
  provide: UserProviderTokens.Models.User,
  useFactory: mongoose => mongoose.connection.model('User', UserSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [UserRepo, UserRepoCache, UserRepoWrite, UserModel],
  exports: [UserRepo, UserRepoCache, UserRepoWrite],
})
export class UserModule {}
