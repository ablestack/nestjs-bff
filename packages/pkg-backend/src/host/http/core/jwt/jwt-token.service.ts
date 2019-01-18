import { IAuthenticationToken } from '@nestjs-bff/global/lib/interfaces/authentication-token.interface';
import { Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { INestjsBffConfig } from '../../../../config/nestjs-bff.config';
import { AccessPermissionsEntity } from '../../../../domain/access-permissions/model/access-permissions.entity';
import { AppSharedProviderTokens } from '../../../../shared/app/app.shared.constants';
import { IJwtPayload } from './i-jwt-payload';

@Injectable()
export class JwtTokenService {
  private signOptions: SignOptions;

  constructor(@Inject(AppSharedProviderTokens.Config.App) private readonly nestjsBffConfig: INestjsBffConfig) {
    this.signOptions = {
      issuer: nestjsBffConfig.jwt.issuer,
      audience: nestjsBffConfig.http.bffRootUrl,
      algorithm: nestjsBffConfig.jwt.signingAlgorithm,
      expiresIn: nestjsBffConfig.jwt.expiresIn,
    };
  }

  public async createToken(accessPermissionsEntity: AccessPermissionsEntity): Promise<IAuthenticationToken> {
    const jwtPayload: Partial<IJwtPayload> = {
      sub: accessPermissionsEntity.id,
      roles: accessPermissionsEntity.roles,
    };
    const token: string = sign(
      jwtPayload,
      {
        key: this.nestjsBffConfig.jwt.jwtPrivateKey,
        passphrase: this.nestjsBffConfig.jwt.jwtPrivateKeyPemPassphrase,
      },
      this.signOptions,
    );

    return { token };
  }
}
