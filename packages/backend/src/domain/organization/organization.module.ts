import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { OrganizationSchema } from './model/organization.schema';
import { OrganizationProviderTokens } from './organization.constants';
import { OrganizationRepoCache } from './repo/organization.repo-cache';
import { OrganizationRepo } from './repo/organization.repo';
import { OrganizationRepoWrite } from './repo/organization.repo-write';

const OrganizationModel = {
  provide: OrganizationProviderTokens.Models.Organization,
  useFactory: mongoose => mongoose.connection.model('Organization', OrganizationSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreModule],
  providers: [OrganizationRepo, OrganizationRepoCache, OrganizationRepoWrite, OrganizationModel],
  exports: [OrganizationRepo, OrganizationRepoCache, OrganizationRepoWrite],
})
export class OrganizationModule {}
