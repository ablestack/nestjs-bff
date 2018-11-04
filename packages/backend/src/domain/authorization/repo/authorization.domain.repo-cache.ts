import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSysProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSysService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from '../../core/repo/base.repo-cache';
import { IAuthorizationModel } from '../model/authorization.domain.model';
import { AuthorizationDomainRepoRead } from './authorization.domain.repo-read';

@Injectable()
export class AuthorizationRepoDomainCache extends BaseRepoCache<
  AuthorizationEntity,
  IAuthorizationModel
> {
  constructor(
    loggerService: LoggerSysService,
    private _repo: AuthorizationDomainRepoRead,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSysProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
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
