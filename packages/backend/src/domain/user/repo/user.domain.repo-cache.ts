import { UserDomainEntity } from '@nestjs-bff/global/lib/lib/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from '../../core/repo/base.repo-cache';
import { IUserDomainModel } from '../model/user.domain.model';
import { UserDomainRepoRead } from './user.domain.repo-read';

@Injectable()
export class UserDomainRepoCache extends BaseRepoCache<
  UserDomainEntity,
  IUserDomainModel
> {
  constructor(
    loggerService: LoggerSharedService,
    repo: UserDomainRepoRead,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App)
    nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      repo,
      cacheStore,
      ttl: nestjsBffConfig.caching.entities.user,
    });
  }
}
