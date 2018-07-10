import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  public async createToken(): Promise<any> {
    // TODO: validate user
    // TODO: construct payload
    const jwtPayload = { email: 'test@email.com', roles: ['staff'] };
    return await this.authService.createToken(jwtPayload);
  }

  @Get('data')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('staff')
  public findAll() {
    // this route is restricted
  }
}
