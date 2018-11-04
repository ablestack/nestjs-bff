import { Module } from '@nestjs/common';
import { AuthenticationDomainModule } from '../../domain/authentication/authentication.domain.module';
import { AuthorizationDomainModule } from '../../domain/authorization/authorization.domain.module';
import { OrganizationDomainModule } from '../../domain/organization/organization.domain.module';
import { UserDomainModule } from '../../domain/user/user.domain.module';
import { CoreApplicationModule } from '../core/core.application.module';
import { UserAuthApplicationService } from './user-auth.application.service';

@Module({
  imports: [
    CoreApplicationModule,
    AuthenticationDomainModule,
    AuthorizationDomainModule,
    UserDomainModule,
    OrganizationDomainModule,
  ],
  providers: [UserAuthApplicationService],
  exports: [UserAuthApplicationService],
})
export class UserAuthApplicationModule {}
