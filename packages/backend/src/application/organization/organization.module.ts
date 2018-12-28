import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../domain/authentication/authentication.module';
import { AuthorizationModule } from '../../domain/authorization/authorization.module';
import { OrganizationModule } from '../../domain/organization/organization.module';
import { UserModule } from '../../domain/user/user.module';
import { CoreModule } from '../core/core.module';
import { OrganizationService } from './organization.service';

@Module({
  imports: [CoreModule, AuthenticationModule, AuthorizationModule, UserModule, OrganizationModule],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
