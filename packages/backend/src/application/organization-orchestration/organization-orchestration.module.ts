import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../domain/authorization/authorization.module';
import { OrganizationModule } from '../../domain/organization/organization.module';
import { UserModule } from '../../domain/user/user.module';
import { CoreModule } from '../core/core.module';
import { OrganizationOrchestrationService } from './organization-orchestration.service';

@Module({
  imports: [CoreModule, AuthenticationModule, AuthorizationModule, UserModule, OrganizationModule],
  providers: [OrganizationOrchestrationService],
  exports: [OrganizationOrchestrationService],
})
export class OrganizationOrchestrationModule {}
