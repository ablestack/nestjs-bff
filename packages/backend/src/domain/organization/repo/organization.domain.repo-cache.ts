import { OrganizationEntity } from '@nestjs-bff/global/entities/organization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from '../../core/repo/base.repo-cache';
import { IOrganizationDomainModel } from '../model/organization.domain.model';
import { OrganizationDomainRepoRead } from './organization.domain.repo-read';

@Injectable()
export class OrganizationDomainRepoCache extends BaseRepoCache<
  OrganizationEntity,
  IOrganizationDomainModel
> {
  constructor(
    private _repo: OrganizationDomainRepoRead,
    loggerService: LoggerSharedService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App)
    nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      repo: _repo,
      cacheStore,
      ttl: nestjsBffConfig.caching.entities.organization,
    });
  }

  public async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    return this.cacheStore.wrap(
      this.makeCacheKeyFromIdentifier(slug, 'slug'),
      () => this._repo.findBySlug(slug),
      {
        ttl: this.ttl,
      },
    );
  }

  protected removeFromCacheBySlug(result: OrganizationEntity) {
    if (!result.slug) throw new AppError('Slug can not be null');
    this.cacheStore.del(this.makeCacheKeyFromIdentifier(result.slug, 'slug'));
    return result;
  }
}
