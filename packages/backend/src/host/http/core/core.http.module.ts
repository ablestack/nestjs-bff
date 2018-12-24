import { Module } from '@nestjs/common';
import { AuthorizationDomainModule } from '../../../domain/authorization/authorization.domain.module';
import { OrganizationDomainModule } from '../../../domain/organization/organization.domain.module';
import { AppSharedModule } from '../../../shared/app/app.shared.module';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { AuthorizationHttpGuard } from './guards/authorization.http.guard';
import { JwtTokenHttpService } from './jwt/jwt-token.http.service';
import { AttachAuthenticationHttpMiddleware } from './middleware/attach-authentication.http.middleware';

@Module({
  imports: [AppSharedModule, AuthorizationDomainModule, OrganizationDomainModule, LoggingSharedModule],
  providers: [AuthorizationHttpGuard, AttachAuthenticationHttpMiddleware, JwtTokenHttpService],
  exports: [LoggingSharedModule, AttachAuthenticationHttpMiddleware, JwtTokenHttpService],
})
export class CoreHttpModule {}
