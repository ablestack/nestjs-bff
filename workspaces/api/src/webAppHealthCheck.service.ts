import { Injectable } from '@nestjs/common';

@Injectable()
export class WebAppHealthCheckService {
  public root(): string {
    return 'UP';
  }
}
