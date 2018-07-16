import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/services/config.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoggerService } from '../common/services/logger.service';
import { AccessTokenWithMetadata } from './interfaces/jwt-accessTokenData.interface';
import { AuthenticateDto } from './dto/authenticate-dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly loggerService: LoggerService) {}

  public async createToken(payload: JwtPayload): Promise<AccessTokenWithMetadata> {
    const expiresIn = 3600;
    const accessToken = jwt.sign(payload, this.configService.jwtSecretKey, { expiresIn });

    this.loggerService.debug('auth.service - createToken', payload, accessToken);

    return {
      expiresIn,
      accessToken,
    };
  }

  /**
   * The object that gets returned from this method gets attached to the request object in the user property
   * @param payload
   *
   * Notes:
   * RoleGuard looks for roles:string[] on the returned property
   */
  public async validateUser(payload: JwtPayload): Promise<any> {
    // put some validation logic here
    // no additional validation needed.  We trust the jwt token provided, and just pass it along (TODO: verify this notion is watertight)
    this.loggerService.debug('auth.service - validateUser - payload', payload);
    return payload;
  }

  public async authenticateUser(authenticateDto: AuthenticateDto): Promise<User> {
    if (authenticateDto.username === 'user@mydomain.com' && authenticateDto.password === 'user') {
      return { username: '', firstName: '', lastName: '' };
    }

    if (authenticateDto.username === 'staff@mydomain.com' && authenticateDto.password === 'staff') {
      return { username: '', firstName: '', lastName: '' };
    }

    return null;
  }
}
