import { Module } from '@nestjs/common';
import { HttpAuthModule } from '../../src/host/http/application-service-host/auth/auth.module';
import { HttpWebAppBaseModule } from '../../src/host/http/web-app-base.module';

@Module({
  imports: [HttpWebAppBaseModule, HttpAuthModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class AuthE2eModule {}
