import { Inject, Injectable } from '@nestjs/common';
import {
  create as createOAuth2Client,
  OAuthClient,
  Token as OAuthClientToken,
} from 'simple-oauth2';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { IOauthAccessToken } from './i-oauth-access-token';

@Injectable()
export class FacebookAuthenticationDomainService {
  private oauthClient: OAuthClient;

  constructor(
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly bffLoggerService: LoggerSharedService,
  ) {
    const oauthClientConfig = {
      client: {
        id: this.nestjsBffConfig.social.facebook.clientID,
        secret: this.nestjsBffConfig.social.facebook.clientSecret,
      },
      auth: {
        authorizeHost: this.nestjsBffConfig.social.facebook.authorizeHost,
        authorizePath: this.nestjsBffConfig.social.facebook.authorizePath,
        tokenHost: this.nestjsBffConfig.social.facebook.tokenHost,
        tokenPath: this.nestjsBffConfig.social.facebook.tokenPath,
      },
    };

    // this.bffLoggerService.debug('FacebookAuthenticationService-init-oauthClientConfig', oauthClientConfig);
    this.oauthClient = createOAuth2Client(oauthClientConfig);
  }

  /**
   *
   * @param spaRootUrl
   */
  public async getOauth2RedirectUrl(
    redirectUri: string,
  ): Promise<{ redirectUrl: string }> {
    const options = {
      redirect_uri: `${redirectUri}`,
      scope: this.nestjsBffConfig.social.facebook.authorizeScope.join(','),
      state: '', // TODO: assess.  not using ATM.  CSRF protection to be handled differently
    };

    const redirectUrl = this.oauthClient.authorizationCode.authorizeURL(
      options,
    );

    return {
      redirectUrl,
    };
  }

  /**
   *
   * @param code
   */
  public async getOauthAccessToken(
    fbAuthorizationCode: string,
    spaRootUrl: string,
  ): Promise<IOauthAccessToken> {
    const tokenConfig = {
      code: `${fbAuthorizationCode}`,
      redirect_uri: `${spaRootUrl}${
        this.nestjsBffConfig.social.facebook.callbackRelativeURL_signIn
      }`,
      scope: this.nestjsBffConfig.social.facebook.authorizeScope,
    };

    try {
      // Get access token
      const result: OAuthClientToken = await this.oauthClient.authorizationCode.getToken(
        tokenConfig,
      );
      return { token: result.access_token };
    } catch (error) {
      this.bffLoggerService.error(
        'Error retrieving Facebook oAuth access token',
        error,
      );
      throw new AppError(
        'There was a problem authenticating you with Facebook',
      );
    }
  }
}
