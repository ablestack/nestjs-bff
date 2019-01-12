import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { ClassValidator } from '../../core/validators/class-validator';
import { UserPermissionsEntity } from '../model/user-permissions.entity';
import { IUserPermissionsModel } from '../model/user-permissions.model';
import { UserPermissionsProviderTokens } from '../user-permissions.constants';

@Injectable()
export class UserPermissionsRepo extends BaseRepo<UserPermissionsEntity, IUserPermissionsModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(UserPermissionsProviderTokens.Models.UserPermissions) model: Model<IUserPermissionsModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      defaultTTL: nestjsBffConfig.caching.entities.authorization,
      entityValidator: new ClassValidator(loggerService, UserPermissionsEntity),
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: UserPermissionsEntity): Array<Partial<UserPermissionsEntity>> {
    throw new Error('Method not implemented.');
  }
}
