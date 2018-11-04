import { IAuthenticationToken } from '@nestjs-bff/universal/interfaces/authentication-token.interface';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHmac } from 'crypto';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSysProviderTokens } from '../../../shared/app/app.shared.constants';
import { LoggerSysService } from '../../../shared/logging/logger.shared.service';

@Injectable()
export class FacebookClientDomainService {
  constructor(
    @Inject(AppSysProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly bffLoggerService: LoggerSysService,
  ) {}

  public async get(
    getRequest: string,
    accessToken: IAuthenticationToken,
  ): Promise<any> {
    // Secure API call by adding proof of the app secret.  This is required when
    // the "Require AppSecret Proof for Server API calls" setting has been
    // enabled.  The proof is a SHA256 hash of the access token, using the app
    // secret as the key.
    //
    // For further details, refer to:
    // https://developers.facebook.com/docs/reference/api/securing-graph-api/
    const proof = createHmac(
      'sha256',
      this.nestjsBffConfig.social.facebook.clientSecret,
    )
      .update(accessToken.token)
      .digest('hex');

    this.bffLoggerService.debug(
      'FacebookClientService-get-nestjsBffConfig',
      this.nestjsBffConfig,
    );

    // Get profile data
    const getRequestWithAuth =
      `${this.nestjsBffConfig.social.facebook.apiHost}` +
      getRequest +
      `&access_token=${accessToken.token}` +
      `&appsecret_proof=${proof}`;

    // Submit request
    this.bffLoggerService.debug(
      'FacebookClientService-get-getRequestWithAuth',
      getRequestWithAuth,
    );
    const result = await axios.get(getRequestWithAuth);
    this.bffLoggerService.debug(
      'FacebookClientService-get-result.data',
      result.data,
    );

    return result.data;
  }
}
