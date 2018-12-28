import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../domain/authorization/authorization.module';
import { OrganizationModule } from '../../domain/organization/organization.module';
import { UserModule } from '../../domain/user/user.module';
import { CoreApplicationModule } from '../core/core.module';
import { UserAuthApplicationService } from './user-auth.service';

@Module({
  imports: [CoreApplicationModule, AuthenticationModule, AuthorizationModule, UserModule, OrganizationModule],
  providers: [UserAuthApplicationService],
  exports: [UserAuthApplicationService],
})
export class UserAuthApplicationModule {}
