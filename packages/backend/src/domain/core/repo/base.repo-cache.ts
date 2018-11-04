import { IEntity } from '@nestjs-bff/universal/interfaces/entity.interface';
import { Document } from 'mongoose';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSysService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from './base.repo-read';

export interface IBaseRepoCacheOptions<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity
> {
  loggerService: LoggerSysService;
  repo: BaseRepoRead<TEntity, TModel>;
  cacheStore: CacheStore;
  ttl: number;
}

export abstract class BaseRepoCache<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity
> {
  private name: string;
  private resourceCacheKey;
  protected readonly loggerService: LoggerSysService;
  protected readonly repo: BaseRepoRead<TEntity, TModel>;
  protected readonly cacheStore: CacheStore;
  protected readonly ttl: number;

  constructor(options: IBaseRepoCacheOptions<TEntity, TModel>) {
    this.loggerService = options.loggerService;
    this.repo = options.repo;
    this.cacheStore = options.cacheStore;
    this.ttl = options.ttl;

    this.name = `CachedRepo<${this.repo.modelName}>`;
    this.resourceCacheKey = `${this.name}?id=`;
  }

  public async findById(id: string): Promise<TEntity | null> {
    this.loggerService.trace(`${this.name}.findById`, { id });
    return this.cacheStore.wrap(
      this.makeCacheKeyFromIdentifier(id),
      () => this.repo.findById(id),
      {
        ttl: this.ttl,
      },
    );
  }

  public async findAll(): Promise<TEntity[]> {
    // straight pass-through.  Don't cache find-all
    return this.repo.findAll();
  }

  protected makeCacheKeyFromResource(resource: Partial<TEntity>): string {
    if (!resource.id) throw new AppError('Id can not be null');
    return this.makeCacheKeyFromIdentifier(resource.id);
  }

  protected makeCacheKeyFromIdentifier(
    identifier: string,
    identifierType: string = 'id',
  ): string {
    return `${this.resourceCacheKey}-${identifierType}-${identifier}`;
  }

  public clear(result: TEntity) {
    if (!result.id) throw new AppError('Id can not be null');
    return this.cacheStore.del(this.makeCacheKeyFromResource(result));
  }
}
