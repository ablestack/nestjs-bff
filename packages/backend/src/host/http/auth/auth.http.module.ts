import { Module } from '@nestjs/common';
import { OrganizationApplicationModule } from '../../../application/organization/organization.application.module';
import { UserAuthApplicationModule } from '../../../application/user-auth/user-auth.application.module';
import { AuthenticationDomainModule } from '../../../domain/authentication/authentication.domain.module';
import { AuthorizationDomainModule } from '../../../domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '../core/core.http.module';
import { AuthHttpController } from './auth.http.controller';

@Module({
  imports: [
    CoreHttpModule,
    UserAuthApplicationModule,
    AuthenticationDomainModule,
    AuthorizationDomainModule,
    OrganizationApplicationModule,
  ],
  controllers: [AuthHttpController],
  providers: [],
  exports: [],
})
export class AuthHttpModule {}
