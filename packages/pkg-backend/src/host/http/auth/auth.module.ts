import { Module } from '@nestjs/common';
import { OrganizationOrchestrationModule } from '../../../application/organization-orchestration/organization-orchestration.module';
import { UserAuthModule } from '../../../application/user-auth/user-auth.module';
import { DomainAuthenticationModule } from '../../../domain/authentication/authentication.module';
import { DomainAuthorizationModule } from '../../../domain/authorization/user-permissions.module';
import { HttpCoreModule } from '../core/core.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpCoreModule, UserAuthModule, DomainAuthenticationModule, DomainAuthorizationModule, OrganizationOrchestrationModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class HttpAuthModule {}
