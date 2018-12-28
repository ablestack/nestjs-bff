import { AuthModule } from '@nestjs-bff/backend/lib/host/http/auth/auth.module';
import { CoreModule } from '@nestjs-bff/backend/lib/host/http/core/core.module';
import { HttpExceptionFilter } from '@nestjs-bff/backend/lib/host/http/core/exceptions/http-exception.filter';
import { AuthorizationGuard } from '@nestjs-bff/backend/lib/host/http/core/guards/authorization.guard';
import { AttachAuthenticationHttpMiddleware } from '@nestjs-bff/backend/lib/host/http/core/middleware/attach-authentication.middleware';
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
import { ReminderModule } from '../hosted-domain-services/reminder/reminder.module';
import { WebAppHealthCheckService } from './web-app-health-check.service';
import { WebAppController } from './web-app.controller';

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
  useClass: AuthorizationGuard,
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
  imports: [CoreModule, AuthModule, ReminderModule, MigrationsSharedModule],
  controllers: [WebAppController],
  providers: [WebAppHealthCheckService, AppFilterProvider, CacheInterceptorProvider, AppGuardProvider, AppPipeProvider],
  exports: undefined,
})
export class WebAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
