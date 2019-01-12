import { Module } from '@nestjs/common';
import { DomainAuthenticationModule } from '../../domain/authentication/authentication.module';
import { DomainAuthorizationModule } from '../../domain/authorization/user-permissions.module';
import { DomainOrganizationModule } from '../../domain/organization/organization.module';
import { DomainUserModule } from '../../domain/user/user.module';
import { CoreModule } from '../core/core.module';
import { UserAuthService } from './user-auth.service';

@Module({
  imports: [CoreModule, DomainAuthenticationModule, DomainAuthorizationModule, DomainUserModule, DomainOrganizationModule],
  providers: [UserAuthService],
  exports: [UserAuthService],
})
export class UserAuthModule {}
