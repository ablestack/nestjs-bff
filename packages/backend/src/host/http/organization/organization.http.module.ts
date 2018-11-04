import { Module } from '@nestjs/common';
import { UserAuthApplicationModule } from '../../../application/user-auth/user-auth.application.module';
import { AuthenticationDomainModule } from '../../../domain/authentication/authentication.domain.module';
import { AuthorizationDomainModule } from '../../../domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '../core/core.http.module';
import { OrganizationHttpController } from './organization.http.controller';

@Module({
  imports: [CoreHttpModule, UserAuthApplicationModule, AuthenticationDomainModule, AuthorizationDomainModule],
  controllers: [OrganizationHttpController],
  providers: [],
  exports: [],
})
export class HttpAuthModule {}
