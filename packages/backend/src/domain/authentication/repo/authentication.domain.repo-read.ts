import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from '../../core/repo/base.repo-read';
import { AuthenticationDomainProviderTokens } from '../authentication.domain.constants';
import { IAuthenticationDomainModel } from '../model/authentication.domain.model';
import { IAuthenticationDomainEntity } from '../model/i-authentication.domain.entity';
import { AuthenticationQueryConditions } from './authentication.query-conditions';

@Injectable()
export class AuthenticationDomainRepoRead extends BaseRepoRead<
  IAuthenticationDomainEntity,
  IAuthenticationDomainModel,
  AuthenticationQueryConditions
> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthenticationDomainProviderTokens.Models.Authentication)
    model: Model<IAuthenticationDomainModel>,
  ) {
    super({ loggerService, model });
  }

  /**
   *
   * @param localEmail
   */
  public async findByLocalEmail(localEmail: string): Promise<IAuthenticationDomainEntity | null> {
    return this.model.findOne({ 'local.email': localEmail });
  }

  /**
   *
   * @param facebookProfileId
   */
  public async findByFacebookId(facebookProfileId: string): Promise<IAuthenticationDomainEntity | null> {
    return this.model.findOne({ 'facebook.id': facebookProfileId });
  }

  /**
   *
   * @param googleProfileId
   */
  public async findByGoogleId(googleProfileId: string): Promise<IAuthenticationDomainEntity | null> {
    return this.model.findOne({ 'google.id': googleProfileId });
  }

  /**
   *
   *
   * @param {string} twitterProfileId
   */
  public async findByTwitterId(twitterProfileId: string): Promise<IAuthenticationDomainEntity | null> {
    return this.model.findOne({ 'twitter.id': twitterProfileId });
  }
}
