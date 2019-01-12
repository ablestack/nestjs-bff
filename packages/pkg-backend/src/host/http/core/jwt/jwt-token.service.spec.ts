import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { UserPermissionsEntity } from '../../../../domain/authorization/model/user-permissions.entity';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { NestjsBffConfig } from '../../../../config/nestjs-bff.config';
import { getLogger } from '../../../../shared/logging/logging.shared.module';
import { JwtTokenService } from './jwt-token.service';

// @ts-ignore
const logger = getLogger();

const verifyOptions: VerifyOptions = {
  issuer: NestjsBffConfig.jwt.issuer,
  audience: NestjsBffConfig.http.bffRootUrl,
  algorithms: [NestjsBffConfig.jwt.signingAlgorithm],
};

describe('JwtTokenService', () => {
  let jwtTokenService: JwtTokenService;

  beforeAll(async () => {
    NestjsBffConfig.jwt.jwtPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBALA6Ud1u8QCBV4X59m4Puu1vpnOie9GsNHAlRUQ161mqPZh/hg4A
RYQoSkwmwZHA4xvEcYeyjm0GPkK5nKtI8RcCAwEAAQJACp5pAmvF797bVEJcnAMs
o1P/9qXKyjaTLlLAmryZAt0KoFBS4Ziaa7M0ItlUeuzZv6xFlAU+ARlUmsOej2Pr
OQIhANmR2ev01axiyo82Xa0qJzeL2IPQgNmVP7M22ARMOLutAiEAz1sN5SwxqcVm
0TACjzwD8SbmueZ23+4vEBB4Ko33eFMCIQCaINvLby+rpnSuzanBEZqkm/ovLxcI
jNWKhPC04rZSJQIgSGguWPluui7hcWjHbAb0BXClHwNYPWfp7T0jCREb+lsCIAJ4
XZYzfe2+VUcYQHG96tJaOrq8pOKySRFw+rBcEGLa
-----END RSA PRIVATE KEY-----`;

    NestjsBffConfig.jwt.jwtPublicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALA6Ud1u8QCBV4X59m4Puu1vpnOie9Gs
NHAlRUQ161mqPZh/hg4ARYQoSkwmwZHA4xvEcYeyjm0GPkK5nKtI8RcCAwEAAQ==
-----END PUBLIC KEY-----`;

    jwtTokenService = new JwtTokenService(NestjsBffConfig);
    // logger.debug('NestjsBffConfig.jwt.jwtPrivateKey', NestjsBffConfig.jwt.jwtPrivateKey);
  });

  describe('createToken', () => {
    it('should return a jwt Token', async () => {
      const authorizationEntity = {
        id: '507f1f77bcf86cd799439011',
        roles: [Roles.user],
      } as UserPermissionsEntity;

      const authToken = await jwtTokenService.createToken(authorizationEntity);
      expect(authToken).toBeDefined();
      expect(authToken).toHaveProperty('token');

      // decode token
      const decodedJwtToken = verify(authToken.token, NestjsBffConfig.jwt.jwtPublicKey, verifyOptions) as any;
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
