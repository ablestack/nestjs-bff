import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HttpWebAppModule } from '../../lib/host/http/web-app.module';
import { HttpAuthModule } from '../../src/host/http/application-service-host/auth/auth.module';
import { AttachAuthenticationHttpMiddleware } from '../../src/host/http/core/middleware/attach-authentication.middleware';

@Module({
  imports: [HttpWebAppModule, HttpAuthModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class AuthE2eModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
