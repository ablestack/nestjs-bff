import { IAuthenticationToken } from '@nestjs-bff/global-contracts/lib/shared/authentication/authentication-token.interface';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { FacebookClientService } from './facebook-client.service';
import { IFacebookProfile } from './facebook-profile.interface';

@Injectable()
export class FacebookProfileService {
  constructor(
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly bffLoggerService: LoggerSharedService,
    private readonly facebookClientService: FacebookClientService,
  ) {}

  public async getProfile(accessToken: IAuthenticationToken): Promise<IFacebookProfile> {
    try {
      // Get profile data
      const fbGetRequest = `${this.nestjsBffConfig.social.facebook.apiProfilePath}?fields=id,first_name,last_name,email`;
      const fbProfileResponse = await this.facebookClientService.get(fbGetRequest, accessToken);

      const result = {
        id: fbProfileResponse.id,
        email: fbProfileResponse.email,
        name: `${fbProfileResponse.last_name} ${fbProfileResponse.last_name}`,
      };

      this.bffLoggerService.debug('FacebookProfileService.getProfile.result', result);

      return result;
    } catch (error) {
      this.bffLoggerService.error('Error retrieving Facebook profile data', error);
      throw new AppError('There was a problem accessing Facebook information during authentication');
    }
  }
}
