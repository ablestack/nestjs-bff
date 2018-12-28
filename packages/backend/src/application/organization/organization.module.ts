import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../domain/authorization/authorization.module';
import { OrganizationModule } from '../../domain/organization/organization.module';
import { UserModule } from '../../domain/user/user.module';
import { CoreApplicationModule } from '../core/core.module';
import { OrganizationApplicationService } from './organization.service';

@Module({
  imports: [CoreApplicationModule, AuthenticationModule, AuthorizationModule, UserModule, OrganizationModule],
  providers: [OrganizationApplicationService],
  exports: [OrganizationApplicationService],
})
export class OrganizationApplicationModule {}
