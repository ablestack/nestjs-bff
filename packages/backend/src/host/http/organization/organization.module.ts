import { Module } from '@nestjs/common';
import { UserAuthApplicationModule } from '../../../application/user-auth/user-auth.module';
import { AuthenticationDomainModule } from '../../../domain/authentication/authentication.module';
import { AuthorizationDomainModule } from '../../../domain/authorization/authorization.module';
import { CoreHttpModule } from '../core/core.module';
import { OrganizationHttpController } from './organization.controller';

@Module({
  imports: [CoreHttpModule, UserAuthApplicationModule, AuthenticationDomainModule, AuthorizationDomainModule],
  controllers: [OrganizationHttpController],
  providers: [],
  exports: [],
})
export class HttpAuthModule {}
