import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { AuthenticationDomainProviderTokens } from '../authentication.constants';
import { AuthenticationEntity } from '../model/authentication.entity';
import { IAuthenticationModel } from '../model/authentication.model';
import { AuthenticationQueryConditions } from './authentication.query-conditions';

@Injectable()
export class AuthenticationDomainRepo extends BaseRepo<AuthenticationEntity, IAuthenticationModel, AuthenticationQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthenticationDomainProviderTokens.Models.Authentication) model: Model<IAuthenticationModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({ loggerService, model, cacheStore, defaultTTL: nestjsBffConfig.caching.entities.user });
  }

  protected generateValidQueryConditionsForCacheClear(entity: AuthenticationEntity): AuthenticationQueryConditions[] {
    throw new Error('Method not implemented.');
  }

  // public async findByLocalEmail(localEmail: string): Promise<AuthenticationEntity | null> {
  //   return this.findOne({ 'local.email': localEmail });
  // }

  // public async findByFacebookId(facebookProfileId: string): Promise<AuthenticationEntity | null> {
  //   return this.findOne({ 'facebook.id': facebookProfileId });
  // }

  // public async findByGoogleId(googleProfileId: string): Promise<AuthenticationEntity | null> {
  //   return this.findOne({ 'google.id': googleProfileId });
  // }

  // public async findByTwitterId(twitterProfileId: string): Promise<AuthenticationEntity | null> {
  //   return this.findOne({ 'twitter.id': twitterProfileId });
  // }
}
