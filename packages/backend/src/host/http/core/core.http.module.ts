import { Module } from '@nestjs/common';
import { AuthorizationDomainModule } from '../../../domain/authorization/authorization.domain.module';
import { OrganizationDomainModule } from '../../../domain/organization/organization.domain.module';
import { AppSysModule } from '../../../shared/app/app.shared.module';
import { LoggingSysModule } from '../../../shared/logging/logging.shared.module';
import { AuthorizationHttpGuard } from './guards/authorization.http.guard';
import { JwtTokenHttpService } from './jwt/jwt-token.http.service';
import { JwtHttpMiddleware } from './jwt/jwt.http.middleware';

@Module({
  imports: [
    AppSysModule,
    AuthorizationDomainModule,
    OrganizationDomainModule,
    LoggingSysModule,
  ],
  providers: [AuthorizationHttpGuard, JwtHttpMiddleware, JwtTokenHttpService],
  exports: [LoggingSysModule, JwtHttpMiddleware, JwtTokenHttpService],
})
export class CoreHttpModule {}
