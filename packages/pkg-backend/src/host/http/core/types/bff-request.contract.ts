import { AuthorizationScopeContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { Request as ExpressRequest } from 'express';

export interface BffRequest extends ExpressRequest {
  authorizationScope?: AuthorizationScopeContract;
}
