import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { CoreDomainModule } from '../core/domain.core.module';
import { AuthorizationDomainProviderTokens } from './authorization.constants';
import { AuthorizationDomainSchema } from './model/authorization.schema';
import { AuthorizationRepoDomainCache } from './repo/authorization.repo-cache';
import { AuthorizationDomainRepo } from './repo/authorization.repo';
import { AuthorizationDomainRepoWrite } from './repo/authorization.repo-write';

const AuthorizationDomainModel = {
  provide: AuthorizationDomainProviderTokens.Models.Authorization,
  useFactory: mongoose => mongoose.connection.model('Authorization', AuthorizationDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [AuthorizationDomainModel, AuthorizationDomainRepo, AuthorizationRepoDomainCache, AuthorizationDomainRepoWrite],
  exports: [AuthorizationDomainRepo, AuthorizationRepoDomainCache, AuthorizationDomainRepoWrite],
})
export class AuthorizationDomainModule {}
