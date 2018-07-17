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
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService, private loggerService: LoggerService) {}

  @Post('authenticate')
  public async authenticate(@Body('authenticateDto') authenticateDto: AuthenticateDto): Promise<any> {
    this.loggerService.debug('auth.controller - authenticate', authenticateDto);

    const user = await this.authService.authenticateUser(authenticateDto);

    // validate user
    if (user) {
      //remove password, and destructure remaining properties into userDto
      const { password, ...userDto } = user;

      // issue and return JWT token
      const jwtPayload = { user: userDto };
      return await this.authService.createToken(jwtPayload);
    } else {
      throw new Error('incorrect username or password');
    }
  }

  @Get('data')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('staff')
  public async findAll() {
    return await this.authService.findAll();
  }
}
