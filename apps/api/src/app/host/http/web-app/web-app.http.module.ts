import { AuthenticationDomainModule } from '@nestjs-bff/backend/domain/authentication/authentication.domain.module';
import { AuthorizationDomainModule } from '@nestjs-bff/backend/domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '@nestjs-bff/backend/host/http/core/core.http.module';
import { AuthorizationHttpGuard } from '@nestjs-bff/backend/host/http/core/guards/authorization.http.guard';
import { JwtHttpMiddleware } from '@nestjs-bff/backend/host/http/core/jwt/jwt.http.middleware';
import {
  CacheInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CatsDomainModule } from '../../../domain/cats/cats.domain.module';
import { WebAppHealthCheckService } from './web-app-health-check.http.service';
import { WebAppController } from './web-app.http.controller';

// Order of execution:
// - Middleware
// - Guards
// - Interceptors (before the stream is manipulated)
// - Pipes
// - Interceptors (after the stream is manipulated)
// - Exception filters (if any exception is caught)

const CacheInterceptorProvider = {
  // setting up global caching
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor,
};

const AppGuardProvider = {
  // setting up global guard
  provide: APP_GUARD,
  useClass: AuthorizationHttpGuard,
};

const AppPipeProvider = {
  // setting up global validation and transformation
  provide: APP_PIPE,
  useFactory: () => new ValidationPipe({ transform: true }),
};

@Module({
  imports: [CoreHttpModule, AuthenticationDomainModule, AuthorizationDomainModule, CatsDomainModule],
  controllers: [WebAppController],
  providers: [WebAppHealthCheckService, CacheInterceptorProvider, AppGuardProvider, AppPipeProvider],
  exports: undefined,
})
export class WebAppHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
