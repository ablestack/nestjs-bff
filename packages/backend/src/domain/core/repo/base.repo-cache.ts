import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Document } from 'mongoose';

import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseQueryConditions } from './base.query-conditions';
import { BaseRepoRead } from './base.repo-read';

export interface IBaseRepoCacheParams<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  loggerService: LoggerSharedService;
  repo: BaseRepoRead<TEntity, TModel, TQueryConditions>;
  cacheStore: CacheStore;
  ttl: number;
}

export abstract class BaseRepoCache<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  private name: string;

  protected readonly loggerService: LoggerSharedService;
  protected readonly repo: BaseRepoRead<TEntity, TModel, TQueryConditions>;
  protected readonly cacheStore: CacheStore;
  protected readonly ttl: number;

  constructor(params: IBaseRepoCacheParams<TEntity, TModel, TQueryConditions>) {
    this.loggerService = params.loggerService;
    this.repo = params.repo;
    this.cacheStore = params.cacheStore;
    this.ttl = params.ttl;

    this.name = `CachedRepo<${this.repo.modelName}>`;
  }

  /**
   *
   * @param conditions
   */
  public async findOne(conditions: Partial<TQueryConditions>): Promise<TEntity> {
    this.loggerService.trace(`${this.name}.findOne`, conditions);

    this.repo.validate(conditions);

    const key = this.makeCacheKeyFromObject(conditions);
    const cachedResult = await this.cacheStore.get<TEntity>(key);
    if (cachedResult) return cachedResult;

    const result = await this.repo.findOne(conditions);
    if (result == null) throw new AppError(`Could not find entity ${this.name} with conditions ${conditions}`);

    this.cacheStore.set(key, result, { ttl: this.ttl });

    return result;
  }

  /**
   *
   * @param conditions
   */
  public async find(conditions: Partial<TQueryConditions>): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.find`, conditions);

    this.repo.validate(conditions);

    const key = this.makeCacheKeyFromObject(conditions);
    const cachedResult = await this.cacheStore.get<TEntity[]>(key);
    if (cachedResult) return cachedResult;
    const result = await this.repo.find(conditions);
    this.cacheStore.set(key, result, { ttl: this.ttl });

    return result;
  }

  public clearCacheByKey(cacheKey: string) {
    if (cacheKey.trim.length > 0) throw new AppError('cacheKey can not be null or whitespace');
    return this.cacheStore.del(cacheKey);
  }
}
