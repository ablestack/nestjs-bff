import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly loggerService: LoggerService) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.loggerService.debug('RolesGuard', user);

    if (!user || !user.roles) {
      return false;
    }

    const hasRole = () => user.roles.some(role => !!roles.find(item => item === role));
    return user && user.roles && hasRole();
  }
}
