import { Module } from '@nestjs/common';
import { CoreDomainModule } from '../../domain/core/domain.core.module';
import { MongoSysProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { UserDomainSchema } from './model/user.domain.schema';
import { UserDomainRepoCache } from './repo/user.domain.repo-cache';
import { UserDomainRepoRead } from './repo/user.domain.repo-read';
import { UserDomainRepoWrite } from './repo/user.domain.repo-write';
import { UserProviderTokens } from './user.domain.constants';

const UserDomainModel = {
  provide: UserProviderTokens.Models.User,
  useFactory: mongoose => mongoose.connection.model('User', UserDomainSchema),
  inject: [MongoSysProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  controllers: [],
  providers: [
    UserDomainRepoRead,
    UserDomainRepoCache,
    UserDomainRepoWrite,
    UserDomainModel,
  ],
  exports: [UserDomainRepoRead, UserDomainRepoCache, UserDomainRepoWrite],
})
export class UserDomainModule {}
