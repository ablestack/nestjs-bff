import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadGatewayHttpError } from '../exceptions/server.http.exception';

@Injectable()
export class ErrorsHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    return call$.pipe(catchError(err => throwError(new BadGatewayHttpError('Message'))));
    // todo - log metadata
  }
}
