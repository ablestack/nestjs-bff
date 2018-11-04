import { Module } from '@nestjs/common';
import { AuthenticationDomainModule } from '../../domain/authentication/authentication.domain.module';
import { AuthorizationDomainModule } from '../../domain/authorization/authorization.domain.module';
import { OrganizationDomainModule } from '../../domain/organization/organization.domain.module';
import { UserDomainModule } from '../../domain/user/user.domain.module';
import { CoreApplicationModule } from '../core/core.application.module';
import { OrganizationApplicationService } from './organization.application.service';

@Module({
  imports: [
    CoreApplicationModule,
    AuthenticationDomainModule,
    AuthorizationDomainModule,
    UserDomainModule,
    OrganizationDomainModule,
  ],
  providers: [OrganizationApplicationService],
  exports: [OrganizationApplicationService],
})
export class OrganizationApplicationModule {}
