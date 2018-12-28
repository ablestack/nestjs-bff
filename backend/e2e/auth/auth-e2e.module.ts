import { AuthModule } from '@nestjs-bff/backend/src/host/http/auth/auth.module';
import { AttachAuthenticationHttpMiddleware } from '@nestjs-bff/backend/src/host/http/core/middleware/attach-authentication.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WebAppModule } from '../../src/app/host/http/web-app/web-app.module';

@Module({
  imports: [WebAppModule, AuthModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class AuthE2eModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
