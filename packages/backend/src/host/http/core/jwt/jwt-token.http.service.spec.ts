import { Roles } from '@nestjs-bff/universal/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { Test } from '@nestjs/testing';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { NestjsBffConfig } from '../../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../../shared/app/app.shared.constants';
import { JwtTokenHttpService } from './jwt-token.http.service';

const verifyOptions: VerifyOptions = {
  issuer: NestjsBffConfig.jwt.issuer,
  audience: NestjsBffConfig.http.bffRootUrl,
  algorithms: [NestjsBffConfig.jwt.signingAlgorithm],
};

describe('JwtTokenService', () => {
  let jwtTokenService: JwtTokenHttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        JwtTokenHttpService,
        {
          provide: AppSharedProviderTokens.Config.App,
          useValue: NestjsBffConfig,
        },
      ],
    }).compile();

    jwtTokenService = module.get<JwtTokenHttpService>(JwtTokenHttpService);
  });

  describe('createToken', () => {
    it('should return a jwt Token', async () => {
      const authorizationEntity = {
        id: '507f1f77bcf86cd799439011',
        roles: [Roles.user],
      } as AuthorizationEntity;

      const authToken = await jwtTokenService.createToken(authorizationEntity);
      expect(authToken).toBeDefined();
      expect(authToken).toHaveProperty('token');

      // decode token
      const decodedJwtToken = verify(
        authToken.token,
        NestjsBffConfig.jwt.jwtPublicKey,
        verifyOptions,
      ) as any;
      expect(decodedJwtToken).toBeDefined();

      expect(decodedJwtToken).toHaveProperty('iat');
      expect(decodedJwtToken.iat).not.toBeNull();

      expect(decodedJwtToken).toHaveProperty('exp');
      expect(decodedJwtToken.exp).not.toBeNull();

      expect(decodedJwtToken).toHaveProperty('aud');
      expect(decodedJwtToken.aud).not.toBeNull();

      expect(decodedJwtToken).toHaveProperty('iss');
      expect(decodedJwtToken.iss).not.toBeNull();

      expect(decodedJwtToken).toHaveProperty('sub');
      expect(decodedJwtToken.sub).not.toBeNull();

      expect(decodedJwtToken).toHaveProperty('roles');
      expect(decodedJwtToken.roles).not.toBeNull();
    });
  });
});
