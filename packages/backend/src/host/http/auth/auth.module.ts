import { Module } from '@nestjs/common';
import { OrganizationApplicationModule } from '../../../application/organization/organization.module';
import { UserAuthApplicationModule } from '../../../application/user-auth/user-auth.module';
import { AuthenticationModule } from '../../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { CoreHttpModule } from '../core/core.module';
import { AuthHttpController } from './auth.controller';

@Module({
  imports: [CoreHttpModule, UserAuthApplicationModule, AuthenticationModule, AuthorizationModule, OrganizationApplicationModule],
  controllers: [AuthHttpController],
  providers: [],
  exports: [],
})
export class AuthHttpModule {}
