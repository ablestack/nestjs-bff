import { Module } from '@nestjs/common';
import { OrganizationOrchestrationModule } from '../../../application/organization-orchestration/organization-orchestration.module';
import { UserAuthModule } from '../../../application/user-auth/user-auth.module';
import { DomainAuthenticationModule } from '../../../domain/authentication/authentication.module';
import { DomainAccessPermissionsModule } from '../../../domain/access-permissions/access-permissions.module';
import { HttpCoreModule } from '../core/core.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpCoreModule, UserAuthModule, DomainAuthenticationModule, DomainAccessPermissionsModule, OrganizationOrchestrationModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class HttpAuthModule {}
