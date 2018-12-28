import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';

@Injectable()
export class RolesHttpGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly bffLoggerService: LoggerSharedService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.bffLoggerService.debug('RolesGuard', user);

    if (!user || !user.roles) {
      return false;
    }

    const hasRole = () =>
      user.roles.some(role => !!roles.find(item => item === role));
    return user && user.roles && hasRole();
  }
}
