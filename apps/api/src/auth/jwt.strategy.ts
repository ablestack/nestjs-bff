import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '../common/services/config.service';

// pulling this method out of imported packaged, to avoid a bug where packed does not get imported properly if used directly from super() (and blows up during e2e)
const extractJwtFromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: extractJwtFromAuthHeaderAsBearerToken,
      secretOrKey: configService.jwtSecretKey,
    });
  }

  // tslint:disable-next-line:ban-types
  public async validate(payload: JwtPayload, done: Function) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
