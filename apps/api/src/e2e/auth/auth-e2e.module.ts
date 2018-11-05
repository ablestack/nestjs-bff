import { AuthHttpModule } from '@nestjs-bff/backend/host/http/auth/auth.http.module';
import { JwtHttpMiddleware } from '@nestjs-bff/backend/host/http/core/jwt/jwt.http.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WebAppHttpModule } from 'app/host/http/web-app/web-app.http.module';

@Module({
  imports: [WebAppHttpModule, AuthHttpModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class AuthE2eModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
