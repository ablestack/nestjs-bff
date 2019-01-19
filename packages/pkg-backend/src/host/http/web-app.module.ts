import { CacheInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MigrationsSharedModule } from '../../shared/migrations/migrations.shared.module';
import { HttpAuthModule } from './application-services-host/auth/auth.module';
import { WebAppHealthCheckController } from './application-services-host/web-app/web-app-health-check.controller';
import { WebAppHealthCheckService } from './application-services-host/web-app/web-app-health-check.service';
import { HttpCoreModule } from './core/core.module';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import { AuthorizationGuard } from './core/guards/authorization.guard';
import { AttachAuthenticationHttpMiddleware } from './core/middleware/attach-authentication.middleware';

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
  imports: [HttpCoreModule, HttpAuthModule, MigrationsSharedModule, WebAppHealthCheckController],
  controllers: [],
  providers: [WebAppHealthCheckService, AppFilterProvider, CacheInterceptorProvider, AppGuardProvider, AppPipeProvider],
  exports: undefined,
})
export class HttpWebAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
