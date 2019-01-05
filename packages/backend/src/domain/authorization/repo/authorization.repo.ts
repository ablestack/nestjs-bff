import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { EntityValidatorService } from '../../core/repo/validators/entity.validator';
import { AuthorizationProviderTokens } from '../authorization.constants';
import { IAuthorizationModel } from '../model/authorization.model';

@Injectable()
export class AuthorizationRepo extends BaseRepo<AuthorizationEntity, IAuthorizationModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthorizationProviderTokens.Models.Authorization) model: Model<IAuthorizationModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      defaultTTL: nestjsBffConfig.caching.entities.authorization,
      entityValidator: new EntityValidatorService(loggerService, AuthorizationEntity),
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: AuthorizationEntity): Array<Partial<AuthorizationEntity>> {
    throw new Error('Method not implemented.');
  }
}
