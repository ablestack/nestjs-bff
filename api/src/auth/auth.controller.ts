import { Controller, Get, Post, Body, Headers, UseGuards, UseInterceptors, Param, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticateDto } from './dto/authenticate-dto';
import { LoggerService } from '../common/services/logger.service';

@Controller('auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService, private loggerService: LoggerService) {}

  @Post('authenticate')
  public async authenticate(@Body('authenticateDto') authenticateDto: AuthenticateDto): Promise<any> {
    // console.log('auth.controller - authenticate', authenticateDto);
    this.loggerService.debug('auth.controller - authenticate', authenticateDto);

    const user = this.authService.authenticateUser(authenticateDto);

    // validate user
    if (user) {
      // issue and return JWT token
      const jwtPayload = { email: 'staff@mydomain.com', roles: ['staff'] };
      return await this.authService.createToken(jwtPayload);
    } else {
      throw new Error('incorrect username or password');
    }
  }

  // @Get('token')
  // public async createToken(): Promise<any> {
  //   // TODO: validate user
  //   // TODO: construct payload
  //   const jwtPayload = { email: 'test@email.com', roles: ['staff'] };
  //   return await this.authService.createToken(jwtPayload);
  // }

  @Get('data')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('staff')
  public findAll() {
    // this route is restricted
  }
}
