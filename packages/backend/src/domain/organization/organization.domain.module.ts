import { Module } from '@nestjs/common';
import { CoreDomainModule } from '../../domain/core/domain.core.module';
import { MongoSysProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { OrganizationDomainSchema } from './model/organization.domain.schema';
import { OrganizationProviderTokens } from './organization.domain.constants';
import { OrganizationDomainRepoCache } from './repo/organization.domain.repo-cache';
import { OrganizationDomainRepoRead } from './repo/organization.domain.repo-read';
import { OrganizationDomainRepoWrite } from './repo/organization.domain.repo-write';

const OrganizationDomainModel = {
  provide: OrganizationProviderTokens.Models.Organization,
  useFactory: mongoose =>
    mongoose.connection.model('Organization', OrganizationDomainSchema),
  inject: [MongoSysProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [
    OrganizationDomainRepoRead,
    OrganizationDomainRepoCache,
    OrganizationDomainRepoWrite,
    OrganizationDomainModel,
  ],
  exports: [
    OrganizationDomainRepoRead,
    OrganizationDomainRepoCache,
    OrganizationDomainRepoWrite,
  ],
})
export class OrganizationDomainModule {}
