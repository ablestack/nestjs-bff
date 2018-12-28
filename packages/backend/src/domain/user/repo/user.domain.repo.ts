import { UserDomainEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { IUserDomainModel } from '../model/user.domain.model';
import { UserProviderTokens } from '../user.domain.constants';
import { UserQueryConditions } from './user.query-conditions';

@Injectable()
export class UserDomainRepo extends BaseRepo<UserDomainEntity, IUserDomainModel, UserQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(UserProviderTokens.Models.User) model: Model<IUserDomainModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({ loggerService, model, cacheStore, defaultTTL: nestjsBffConfig.caching.entities.user });
  }

  protected generateValidQueryConditionsForCacheClear(entity: UserDomainEntity): UserQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
