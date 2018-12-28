import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../../../domain/authorization/authorization.module';
import { OrganizationModule } from '../../../domain/organization/organization.module';
import { AppSharedModule } from '../../../shared/app/app.shared.module';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { AuthorizationHttpGuard } from './guards/authorization.guard';
import { JwtTokenHttpService } from './jwt/jwt-token.service';
import { AttachAuthenticationHttpMiddleware } from './middleware/attach-authentication.middleware';

@Module({
  imports: [AppSharedModule, AuthorizationModule, OrganizationModule, LoggingSharedModule],
  providers: [AuthorizationHttpGuard, AttachAuthenticationHttpMiddleware, JwtTokenHttpService],
  exports: [LoggingSharedModule, AttachAuthenticationHttpMiddleware, JwtTokenHttpService],
})
export class CoreHttpModule {}
