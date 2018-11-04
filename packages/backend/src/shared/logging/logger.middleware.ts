import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { LoggerSysService } from '../../shared/logging/logger.shared.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerSysService) {}

  resolve(context: string): MiddlewareFunction {
    return (req, res, next) => {
      this.logger.debug(`[${context}] Request...`);
      if (next) next();
    };
  }
}
