import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { QueryValidatorService } from '../../core/repo/validators/query-validator.service';
import { AuthorizationProviderTokens } from '../authorization.constants';
import { IAuthorizationModel } from '../model/authorization.model';
import { AuthorizationQueryConditions } from './authorization.query-conditions';

@Injectable()
export class AuthorizationRepo extends BaseRepo<AuthorizationEntity, IAuthorizationModel, AuthorizationQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    queryValidatorService: QueryValidatorService<AuthorizationQueryConditions>,
    @Inject(AuthorizationProviderTokens.Models.Authorization) model: Model<IAuthorizationModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      queryValidatorService,
      model,
      cacheStore,
      defaultTTL: nestjsBffConfig.caching.entities.authorization,
      queryConditionsType: AuthorizationQueryConditions,
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: AuthorizationEntity): AuthorizationQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
