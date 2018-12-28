import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { CoreDomainModule } from '../core/domain.core.module';
import { AuthenticationDomainProviderTokens } from './authentication.domain.constants';
import { AuthenticationDomainSchema } from './model/authentication.domain.schema';
import { AuthenticationDomainRepoRead } from './repo/authentication.domain.repo-read';
import { AuthenticationDomainRepoWrite } from './repo/authentication.domain.repo-write';
import { FacebookAuthenticationDomainService } from './social/facebook-authentication.domain.service';
import { FacebookClientDomainService } from './social/facebook-client.domain.service';
import { FacebookProfileDomainService } from './social/facebook-profile.domain..service';

const AuthenticationDomainModel = {
  provide: AuthenticationDomainProviderTokens.Models.Authentication,
  useFactory: mongoose => mongoose.connection.model('Authentication', AuthenticationDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [
    AuthenticationDomainRepoRead,
    AuthenticationDomainRepoWrite,
    FacebookClientDomainService,
    FacebookProfileDomainService,
    FacebookAuthenticationDomainService,
    AuthenticationDomainModel,
  ],
  exports: [AuthenticationDomainRepoRead, AuthenticationDomainRepoWrite, FacebookAuthenticationDomainService, FacebookProfileDomainService],
})
export class AuthenticationDomainModule {}
