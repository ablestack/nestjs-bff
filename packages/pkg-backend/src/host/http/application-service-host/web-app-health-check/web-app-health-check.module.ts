import { Module } from '@nestjs/common';
import { WebAppHealthCheckController } from './web-app-health-check.controller';
import { WebAppHealthCheckService } from './web-app-health-check.service';

@Module({
  imports: [],
  controllers: [WebAppHealthCheckController],
  providers: [WebAppHealthCheckService],
  exports: [],
})
export class WebAppHealthCheckModule {}
