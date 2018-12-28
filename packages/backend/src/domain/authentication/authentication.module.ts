import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { CoreModule } from '../core/core.module';
import { AuthenticationProviderTokens } from './authentication.constants';
import { AuthenticationSchema } from './model/authentication.schema';
import { AuthenticationRepo } from './repo/authentication.repo';
import { AuthenticationRepo } from './repo/authentication.repo';
import { FacebookAuthenticationService } from './social/facebook-authentication.service';
import { FacebookClientService } from './social/facebook-client.service';
import { FacebookProfileService } from './social/facebook-profile..service';

const AuthenticationModel = {
  provide: AuthenticationProviderTokens.Models.Authentication,
  useFactory: mongoose => mongoose.connection.model('Authentication', AuthenticationSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreModule],
  providers: [
    AuthenticationRepo,
    AuthenticationRepo,
    FacebookClientService,
    FacebookProfileService,
    FacebookAuthenticationService,
    AuthenticationModel,
  ],
  exports: [AuthenticationRepo, AuthenticationRepo, FacebookAuthenticationService, FacebookProfileService],
})
export class AuthenticationModule {}
