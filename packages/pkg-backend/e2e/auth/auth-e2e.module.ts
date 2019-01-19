import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HttpAuthModule } from '../../src/host/http/application-services-host/auth/auth.module';
import { AttachAuthenticationHttpMiddleware } from '../../src/host/http/core/middleware/attach-authentication.middleware';
import { HttpWebAppModule } from '../../src/host/http/web-app.module';

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
