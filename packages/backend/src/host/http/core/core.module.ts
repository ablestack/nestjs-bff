import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { OrganizationModule } from '../../../domain/organization/organization.module';
import { AppSharedModule } from '../../../shared/app/app.shared.module';
import { CachingSharedModule } from '../../../shared/caching/caching.shared.module';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { AuthorizationGuard } from './guards/authorization.guard';
import { JwtTokenService } from './jwt/jwt-token.service';
import { AttachAuthenticationHttpMiddleware } from './middleware/attach-authentication.middleware';

@Module({
  imports: [AppSharedModule, AuthorizationModule, OrganizationModule, LoggingSharedModule, CachingSharedModule],
  providers: [AuthorizationGuard, AttachAuthenticationHttpMiddleware, JwtTokenService],
  exports: [LoggingSharedModule, AttachAuthenticationHttpMiddleware, JwtTokenService],
})
export class CoreModule {}
