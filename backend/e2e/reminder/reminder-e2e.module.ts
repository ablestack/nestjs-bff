import { AttachAuthenticationHttpMiddleware } from '@nestjs-bff/backend/lib/host/http/core/middleware/attach-authentication.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HttpWebAppModule } from '../../src/app/host/http/web-app.module';

@Module({
  imports: [HttpWebAppModule, ReminderE2eModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class ReminderE2eModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
