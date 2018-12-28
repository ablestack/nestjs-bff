import { UserEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { IUserModel } from '../model/user.model';
import { UserProviderTokens } from '../user.constants';
import { UserQueryConditions } from './user.query-conditions';

@Injectable()
export class UserRepo extends BaseRepo<UserEntity, IUserModel, UserQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(UserProviderTokens.Models.User) model: Model<IUserModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({ loggerService, model, cacheStore, defaultTTL: nestjsBffConfig.caching.entities.user });
  }

  protected generateValidQueryConditionsForCacheClear(entity: UserEntity): UserQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
