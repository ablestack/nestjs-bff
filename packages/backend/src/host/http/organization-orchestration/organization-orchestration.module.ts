import { Module } from '@nestjs/common';
import { UserAuthModule } from '../../../application/user-auth/user-auth.module';
import { AuthenticationModule } from '../../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { CoreModule } from '../core/core.module';
import { OrganizationOrchestrationController } from './organization-orchestration.controller';

@Module({
  imports: [CoreModule, UserAuthModule, AuthenticationModule, AuthorizationModule],
  controllers: [OrganizationOrchestrationController],
  providers: [],
  exports: [],
})
export class OrganizationOrchestrationModule {}
