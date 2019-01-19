import { Module } from '@nestjs/common';
import { WebAppHealthCheckController } from './web-app-health-check.controller';

@Module({
  imports: [],
  controllers: [WebAppHealthCheckController],
  providers: [],
  exports: [],
})
export class WebAppModule {}
