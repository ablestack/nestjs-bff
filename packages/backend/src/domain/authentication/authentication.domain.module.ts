import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { CoreDomainModule } from '../core/domain.core.module';
import { AuthenticationDomainProviderTokens } from './authentication.domain.constants';
import { AuthenticationSchema } from './model/authentication.schema';
import { AuthenticationDomainRepo } from './repo/authentication.domain.repo';
import { AuthenticationDomainRepoWrite } from './repo/authentication.domain.repo-write';
import { FacebookAuthenticationDomainService } from './social/facebook-authentication.domain.service';
import { FacebookClientDomainService } from './social/facebook-client.domain.service';
import { FacebookProfileDomainService } from './social/facebook-profile.domain..service';

const AuthenticationModel = {
  provide: AuthenticationDomainProviderTokens.Models.Authentication,
  useFactory: mongoose => mongoose.connection.model('Authentication', AuthenticationSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [
    AuthenticationDomainRepo,
    AuthenticationDomainRepoWrite,
    FacebookClientDomainService,
    FacebookProfileDomainService,
    FacebookAuthenticationDomainService,
    AuthenticationModel,
  ],
  exports: [AuthenticationDomainRepo, AuthenticationDomainRepoWrite, FacebookAuthenticationDomainService, FacebookProfileDomainService],
})
export class AuthenticationDomainModule {}
