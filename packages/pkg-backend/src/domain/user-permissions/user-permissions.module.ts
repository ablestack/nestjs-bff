import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { DomainCoreModule } from '../core/core.module';
import { UserPermissionsSchema } from './model/user-permissions.schema';
import { UserPermissionsRepo } from './repo/user-permissions.repo';
import { UserPermissionsProviderTokens } from './user-permissions.constants';

const UserPermissionsModel = {
  provide: UserPermissionsProviderTokens.Models.UserPermissions,
  useFactory: mongoose => mongoose.connection.model('UserPermissions', UserPermissionsSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [DomainCoreModule],
  providers: [UserPermissionsModel, UserPermissionsRepo],
  exports: [UserPermissionsRepo],
})
export class DomainAuthorizationModule {}
