import { Controller, Get } from '@nestjs/common';
import { WebAppHealthCheckService } from './web-app-health-check.service';

@Controller()
export class WebAppController {
  constructor(private readonly appService: WebAppHealthCheckService) {}

  @Get()
  public root(): string {
    return this.appService.root();
  }
}
