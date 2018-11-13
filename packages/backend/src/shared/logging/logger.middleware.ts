import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { LoggerSharedService } from '../../shared/logging/logger.shared.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerSharedService) {}

  resolve(context: string): MiddlewareFunction {
    return (req, res, next) => {
      this.logger.debug(`[${context}] Request...`);
      if (next) next();
    };
  }
}
