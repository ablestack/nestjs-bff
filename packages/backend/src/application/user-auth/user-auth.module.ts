import { Module } from '@nestjs/common';
import { AuthenticationDomainModule } from '../../domain/authentication/authentication.module';
import { AuthorizationDomainModule } from '../../domain/authorization/authorization.module';
import { OrganizationDomainModule } from '../../domain/organization/organization.module';
import { UserDomainModule } from '../../domain/user/user.module';
import { CoreApplicationModule } from '../core/core.module';
import { UserAuthApplicationService } from './user-auth.service';

@Module({
  imports: [CoreApplicationModule, AuthenticationDomainModule, AuthorizationDomainModule, UserDomainModule, OrganizationDomainModule],
  providers: [UserAuthApplicationService],
  exports: [UserAuthApplicationService],
})
export class UserAuthApplicationModule {}
