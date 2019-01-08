import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { DomainCoreModule } from '../core/core.module';
import { AuthorizationProviderTokens } from './authorization.constants';
import { AuthorizationSchema } from './model/authorization.schema';
import { AuthorizationRepo } from './repo/authorization.repo';

const AuthorizationModel = {
  provide: AuthorizationProviderTokens.Models.Authorization,
  useFactory: mongoose => mongoose.connection.model('Authorization', AuthorizationSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [DomainCoreModule],
  providers: [AuthorizationModel, AuthorizationRepo],
  exports: [AuthorizationRepo],
})
export class DomainAuthorizationModule {}
