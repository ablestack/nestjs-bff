import { Module } from '@nestjs/common';
import { CoreDomainModule } from '../../domain/core/domain.core.module';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { UserDomainSchema } from './model/user.domain.schema';
import { UserDomainRepo } from './repo/user.domain.repo';
import { UserDomainRepoCache } from './repo/user.domain.repo-cache';
import { UserDomainRepoWrite } from './repo/user.domain.repo-write';
import { UserProviderTokens } from './user.domain.constants';

const UserDomainModel = {
  provide: UserProviderTokens.Models.User,
  useFactory: mongoose => mongoose.connection.model('User', UserDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  controllers: [],
  providers: [UserDomainRepo, UserDomainRepoCache, UserDomainRepoWrite, UserDomainModel],
  exports: [UserDomainRepo, UserDomainRepoCache, UserDomainRepoWrite],
})
export class UserDomainModule {}
