import { Module } from '@nestjs/common';
import { AuthenticationDomainModule } from '../../domain/authentication/authentication.module';
import { AuthorizationDomainModule } from '../../domain/authorization/authorization.module';
import { OrganizationDomainModule } from '../../domain/organization/organization.module';
import { UserDomainModule } from '../../domain/user/user.module';
import { CoreApplicationModule } from '../core/core.module';
import { OrganizationApplicationService } from './organization.service';

@Module({
  imports: [CoreApplicationModule, AuthenticationDomainModule, AuthorizationDomainModule, UserDomainModule, OrganizationDomainModule],
  providers: [OrganizationApplicationService],
  exports: [OrganizationApplicationService],
})
export class OrganizationApplicationModule {}
