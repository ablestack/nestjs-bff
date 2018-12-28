import { Module } from '@nestjs/common';
import { UserAuthModule } from '../../../application/user-auth/user-auth.module';
import { AuthenticationModule } from '../../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { CoreModule } from '../core/core.module';
import { OrganizationController } from './organization.controller';

@Module({
  imports: [CoreModule, UserAuthModule, AuthenticationModule, AuthorizationModule],
  controllers: [OrganizationController],
  providers: [],
  exports: [],
})
export class HttpAuthModule {}
