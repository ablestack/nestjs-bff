import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Validator } from 'class-validator';
import { Document } from 'mongoose';
import * as hash from 'object-hash';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from './base.repo-read';
import { BaseQueryConditions } from './query-conditions/base-query-conditions';

export interface IBaseRepoCacheOptions<
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
  private cacheKeyBase;
  protected readonly loggerService: LoggerSharedService;
  protected readonly repo: BaseRepoRead<TEntity, TModel, TQueryConditions>;
  protected readonly cacheStore: CacheStore;
  protected readonly ttl: number;
  protected readonly validator: Validator;

  constructor(options: IBaseRepoCacheOptions<TEntity, TModel, TQueryConditions>) {
    this.loggerService = options.loggerService;
    this.repo = options.repo;
    this.cacheStore = options.cacheStore;
    this.ttl = options.ttl;

    this.name = `CachedRepo<${this.repo.modelName}>`;
    this.cacheKeyBase = `${this.name}-cacheKey-`;
    this.validator = new Validator();
  }

  public async findOne(conditions: TQueryConditions): Promise<TEntity | null> {
    this.loggerService.trace(`${this.name}.findOne`, conditions);

    this.repo.validate(conditions);

    const key = this.makeCacheKeyFromObject(conditions);
    const cachedResult = await this.cacheStore.get<TEntity>(key);
    if (cachedResult) return cachedResult;
    const result = await this.repo.findOne(conditions);
    this.cacheStore.set(key, result, { ttl: this.ttl });

    return result;
  }

  public async find(conditions: TQueryConditions): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.find`, conditions);

    this.repo.validate(conditions);

    const key = this.makeCacheKeyFromObject(conditions);
    const cachedResult = await this.cacheStore.get<TEntity[]>(key);
    if (cachedResult) return cachedResult;
    const result = await this.repo.find(conditions);
    this.cacheStore.set(key, result, { ttl: this.ttl });

    return result;
  }

  protected makeCacheKeyFromId(entityId: string): string {
    this.validator.isMongoId(entityId);
    return this.makeCacheKeyFromProperty(entityId, 'id');
  }

  protected makeCacheKeyFromProperty(propertyValue: string, propertyName: string): string {
    this.validator.isNotEmpty(propertyValue);
    this.validator.isNotEmpty(propertyName);
    return `${this.cacheKeyBase}-${propertyName}-${propertyValue}`;
  }

  protected makeCacheKeyFromObject(object: object): string {
    return hash(object);
  }

  public clearCacheById(entityId: string) {
    return this.cacheStore.del(this.makeCacheKeyFromId(entityId));
  }

  public clearCacheByProperty(propertyValue: string, propertyName: string) {
    return this.cacheStore.del(this.makeCacheKeyFromProperty(propertyValue, propertyName));
  }

  public clearCacheByObject(object: object) {
    return this.cacheStore.del(this.makeCacheKeyFromObject(object));
  }

  public clearCacheByKey(cacheKey: string) {
    if (cacheKey.trim.length > 0) throw new AppError('cacheKey can not be null or whitespace');
    return this.cacheStore.del(cacheKey);
  }
}
