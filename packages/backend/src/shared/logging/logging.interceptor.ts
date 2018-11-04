import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerSysService } from '../../shared/logging/logger.shared.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerSysService) {}

  public intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    this.logger.trace('Before...');

    const now = Date.now();
    return call$.pipe(
      tap(() => this.logger.trace(`After... ${Date.now() - now}ms`)),
    );
  }
}
