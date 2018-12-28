import { Module } from '@nestjs/common';
import { OrganizationOrchestrationModule } from '../../../application/organization-orchestration/organization-orchestration.module';
import { UserAuthModule } from '../../../application/user-auth/user-auth.module';
import { AuthenticationModule } from '../../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { CoreModule } from '../core/core.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [CoreModule, UserAuthModule, AuthenticationModule, AuthorizationModule, OrganizationOrchestrationModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
