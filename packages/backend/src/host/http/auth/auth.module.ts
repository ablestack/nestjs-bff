import { Module } from '@nestjs/common';
import { OrganizationModule } from '../../../application/organization/organization.module';
import { UserAuthModule } from '../../../application/user-auth/user-auth.module';
import { AuthenticationModule } from '../../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { CoreModule } from '../core/core.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [CoreModule, UserAuthModule, AuthenticationModule, AuthorizationModule, OrganizationModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
