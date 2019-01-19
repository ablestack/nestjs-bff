import { HttpWebAppModule as PkgBackendHttpWebAppModule } from '@nestjs-bff/backend/lib/host/http/web-app.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PkgBackendHttpWebAppModule],
  controllers: [],
  providers: [],
  exports: undefined,
})
export class HttpWebAppModule {}
