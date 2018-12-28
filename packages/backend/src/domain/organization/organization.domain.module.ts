import { Module } from '@nestjs/common';
import { CoreDomainModule } from '../../domain/core/domain.core.module';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { OrganizationDomainSchema } from './model/organization.domain.schema';
import { OrganizationProviderTokens } from './organization.domain.constants';
import { OrganizationDomainRepoCache } from './repo/organization.domain.repo-cache';
import { OrganizationDomainRepo } from './repo/organization.domain.repo';
import { OrganizationDomainRepoWrite } from './repo/organization.domain.repo-write';

const OrganizationDomainModel = {
  provide: OrganizationProviderTokens.Models.Organization,
  useFactory: mongoose => mongoose.connection.model('Organization', OrganizationDomainSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [CoreDomainModule],
  providers: [OrganizationDomainRepo, OrganizationDomainRepoCache, OrganizationDomainRepoWrite, OrganizationDomainModel],
  exports: [OrganizationDomainRepo, OrganizationDomainRepoCache, OrganizationDomainRepoWrite],
})
export class OrganizationDomainModule {}
