import { Module } from '@nestjs/common';
import { MongoSysProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { CoreDomainModule } from '../core/domain.core.module';
import { AuthorizationDomainProviderTokens } from './authorization.domain.constants';
import { AuthorizationDomainSchema } from './model/authorization.domain.schema';
import { AuthorizationRepoDomainCache } from './repo/authorization.domain.repo-cache';
import { AuthorizationDomainRepoRead } from './repo/authorization.domain.repo-read';
import { AuthorizationDomainRepoWrite } from './repo/authorization.domain.repo-write';

const AuthorizationDomainModel = {
  provide: AuthorizationDomainProviderTokens.Models.Authorization,
  useFactory: mongoose =>
    mongoose.connection.model('Authorization', AuthorizationDomainSchema),
  inject: [MongoSysProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [
    AuthorizationDomainModel,
    AuthorizationDomainRepoRead,
    AuthorizationRepoDomainCache,
    AuthorizationDomainRepoWrite,
  ],
  exports: [
    AuthorizationDomainRepoRead,
    AuthorizationRepoDomainCache,
    AuthorizationDomainRepoWrite,
  ],
})
export class AuthorizationDomainModule {}
