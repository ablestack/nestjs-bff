import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { ClassValidator } from '../../core/validators/class-validator';
import { AuthenticationProviderTokens } from '../authentication.constants';
import { AuthenticationEntity } from '../model/authentication.entity';
import { IAuthenticationModel } from '../model/authentication.model';

@Injectable()
export class AuthenticationRepo extends BaseRepo<AuthenticationEntity, IAuthenticationModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthenticationProviderTokens.Models.Authentication) model: Model<IAuthenticationModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      defaultTTL: nestjsBffConfig.caching.entities.user,
      entityValidator: new ClassValidator(loggerService, AuthenticationEntity),
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: AuthenticationEntity): object[] {
    return [{ _id: entity._id, userId: entity.userId }];
  }
}
