import { AuthHttpModule } from '@nestjs-bff/backend/lib/host/http/auth/auth.http.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.http.module';
import { HttpExceptionFilter } from '@nestjs-bff/backend/lib/host/http/core/exceptions/http-exception.http.filter';
import { AuthorizationHttpGuard } from '@nestjs-bff/backend/lib/host/http/core/guards/authorization.http.guard';
import { JwtHttpMiddleware } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt.http.middleware';
import { MigrationsSharedModule } from '@nestjs-bff/backend/lib/shared/migrations/migrations.shared.module';
import {
  CacheInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ReminderHttpModule } from '../hosted-domain-services/reminder/reminder.http.module';
import { WebAppHealthCheckService } from './web-app-health-check.http.service';
import { WebAppController } from './web-app.http.controller';

// Order of execution:
// - Middleware
// - Guards
// - Interceptors (before the stream is manipulated)
// - Pipes
// - Interceptors (after the stream is manipulated)
// - Exception filters (if any exception is caught)

const AppFilterProvider = {
  // setting up global filter
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};

const AppGuardProvider = {
  // setting up global guard
  provide: APP_GUARD,
  useClass: AuthorizationHttpGuard,
};

const CacheInterceptorProvider = {
  // setting up global caching
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor,
};

const AppPipeProvider = {
  // setting up global validation and transformation
  provide: APP_PIPE,
  useFactory: () => new ValidationPipe({ transform: true }),
};

@Module({
  imports: [CoreHttpModule, AuthHttpModule, ReminderHttpModule, MigrationsSharedModule],
  controllers: [WebAppController],
  providers: [WebAppHealthCheckService, AppFilterProvider, CacheInterceptorProvider, AppGuardProvider, AppPipeProvider],
  exports: undefined,
})
export class WebAppHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
