import { Controller, Get, Post, Body, Headers, UseGuards, UseInterceptors, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticateDto } from './dto/authenticate-dto';

@Controller('auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async authenticate(@Body() authenticateDto: AuthenticateDto): Promise<any> {
    // validate user
    if (await this.authService.authenticateUser(authenticateDto)) {
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
