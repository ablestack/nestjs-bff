import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { ClassValidator } from '../../core/validators/class-validator';
import { AccessPermissionsProviderTokens } from '../access-permissions.constants';
import { AccessPermissionsEntity } from '../model/access-permissions.entity';
import { IAccessPermissionsModel } from '../model/access-permissions.model';
import { AccessPermissionsEntityAuthCheck } from './access-permissions-entity.authcheck';

@Injectable()
export class AccessPermissionsRepo extends BaseRepo<AccessPermissionsEntity, IAccessPermissionsModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AccessPermissionsProviderTokens.Models.AccessPermissions) model: Model<IAccessPermissionsModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      defaultTTL: nestjsBffConfig.caching.entities.authorization,
      entityValidator: new ClassValidator(loggerService, AccessPermissionsEntity),
      entityAuthChecker: new AccessPermissionsEntityAuthCheck(),
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: AccessPermissionsEntity): object[] {
    return [{ _id: entity._id, userId: entity.userId }];
  }
}
