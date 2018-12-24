import { AuthHttpModule } from '@nestjs-bff/backend/lib/host/http/auth/auth.http.module';
import { AttachAuthenticationHttpMiddleware } from '@nestjs-bff/backend/lib/host/http/core/middleware/attach-authentication.http.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WebAppHttpModule } from '../../src/app/host/http/web-app/web-app.http.module';

@Module({
  imports: [WebAppHttpModule, AuthHttpModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class AuthE2eModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
