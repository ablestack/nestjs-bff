import { Module } from '@nestjs/common';
import { DomainAccessPermissionsModule } from '../../domain/access-permissions/access-permissions.module';
import { DomainAuthenticationModule } from '../../domain/authentication/authentication.module';
import { DomainOrganizationModule } from '../../domain/organization/organization.module';
import { DomainUserModule } from '../../domain/user/user.module';
import { CoreModule } from '../core/core.module';
import { OrganizationOrchestrationService } from './organization-orchestration.service';

@Module({
  imports: [CoreModule, DomainAuthenticationModule, DomainAccessPermissionsModule, DomainUserModule, DomainOrganizationModule],
  providers: [OrganizationOrchestrationService],
  exports: [OrganizationOrchestrationService],
})
export class OrganizationOrchestrationModule {}
