import { Module } from '@nestjs/common';
import { AuthorizationDomainModule } from '../../../domain/authorization/authorization.domain.module';
import { OrganizationDomainModule } from '../../../domain/organization/organization.domain.module';
import { AppSharedModule } from '../../../shared/app/app.shared.module';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { AuthorizationHttpGuard } from './guards/authorization.http.guard';
import { JwtTokenHttpService } from './jwt/jwt-token.http.service';
import { JwtHttpMiddleware } from './jwt/jwt.http.middleware';

@Module({
  imports: [
    AppSharedModule,
    AuthorizationDomainModule,
    OrganizationDomainModule,
    LoggingSharedModule,
  ],
  providers: [AuthorizationHttpGuard, JwtHttpMiddleware, JwtTokenHttpService],
  exports: [LoggingSharedModule, JwtHttpMiddleware, JwtTokenHttpService],
})
export class CoreHttpModule {}
