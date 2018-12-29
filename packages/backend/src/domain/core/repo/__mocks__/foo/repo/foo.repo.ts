import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../../../../core/repo/base.repo';
import { FooProviderTokens } from '../foo.constants';
import { FooEntity } from '../model/foo.entity';
import { IFooModel } from '../model/foo.model';
import { FooQueryConditions } from './foo.query-conditions';

@Injectable()
export class FooRepo extends BaseRepo<FooEntity, IFooModel, FooQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(FooProviderTokens.Models.Foo) model: Model<IFooModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({ loggerService, model, cacheStore, defaultTTL: nestjsBffConfig.caching.entities.user });
  }

  protected generateValidQueryConditionsForCacheClear(entity: FooEntity): FooQueryConditions[] {
    throw new Error('Method not implemented.');
  }
}
