import { IAuthenticationToken } from '@nestjs-bff/global/interfaces/authentication-token.interface';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { FacebookClientDomainService } from './facebook-client.domain.service';
import { IFacebookProfile } from './facebook-profile.domain.interface';

@Injectable()
export class FacebookProfileDomainService {
  constructor(
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly bffLoggerService: LoggerSharedService,
    private readonly facebookClientService: FacebookClientDomainService,
  ) {}

  public async getProfile(
    accessToken: IAuthenticationToken,
  ): Promise<IFacebookProfile> {
    try {
      // Get profile data
      const fbGetRequest = `${
        this.nestjsBffConfig.social.facebook.apiProfilePath
      }?fields=id,first_name,last_name,email`;
      const fbProfileResponse = await this.facebookClientService.get(
        fbGetRequest,
        accessToken,
      );

      const result = {
        id: fbProfileResponse.id,
        email: fbProfileResponse.email,
        name: `${fbProfileResponse.last_name} ${fbProfileResponse.last_name}`,
      };

      this.bffLoggerService.debug(
        'FacebookProfileService.getProfile.result',
        result,
      );

      return result;
    } catch (error) {
      this.bffLoggerService.error(
        'Error retrieving Facebook profile data',
        error,
      );
      throw new AppError(
        'There was a problem accessing Facebook information during authentication',
      );
    }
  }
}
