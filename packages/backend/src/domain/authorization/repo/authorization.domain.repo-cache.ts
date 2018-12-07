import { AuthorizationEntity } from '@nestjs-bff/global/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from '../../core/repo/base.repo-cache';
import { IAuthorizationModel } from '../model/authorization.domain.model';
import { AuthorizationDomainRepoRead } from './authorization.domain.repo-read';

@Injectable()
export class AuthorizationRepoDomainCache extends BaseRepoCache<
  AuthorizationEntity,
  IAuthorizationModel
> {
  constructor(
    loggerService: LoggerSharedService,
    private _repo: AuthorizationDomainRepoRead,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App)
    nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      repo: _repo,
      cacheStore,
      ttl: nestjsBffConfig.caching.entities.user,
    });
  }

  public async findByUserId(
    userId: string,
  ): Promise<AuthorizationEntity | null> {
    return this.cacheStore.wrap(
      this.makeCacheKeyFromIdentifier(userId, 'userId'),
      () => this._repo.findByUserId(userId),
      {
        ttl: this.ttl,
      },
    );
  }
}
