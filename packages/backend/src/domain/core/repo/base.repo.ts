import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { validate } from 'class-validator';
import { Document, Model } from 'mongoose';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingUtils } from '../../../shared/caching/caching.utils';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseQueryConditions } from './base.query-conditions';

export interface IBaseRepoParams<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  cacheStore: CacheStore;
  defaultTTL: number;
}

/**
 * Base repo query repository
 *
 * Notes:
 *  - By default will try to validate that org and user filtering in in place, unless overridden with params
 *  - FindAll can be achieved with find, passing no conditions
 */
export abstract class BaseRepo<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  private readonly name: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;
  public readonly modelName: string;
  protected readonly cacheStore: CacheStore;
  protected readonly defaultTTL: number;

  /**
   *
   * @param options
   */
  constructor(params: IBaseRepoParams<TEntity, TModel, TQueryConditions>) {
    this.loggerService = params.loggerService;
    this.model = params.model;
    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
    this.cacheStore = params.cacheStore;
    this.defaultTTL = params.defaultTTL;
  }

  /**
   *
   *
   * @param {TQueryConditions} queryConditions
   * @param {string[]} [validationGroups=[]]
   * @memberof BaseRepo
   * @description Validates query conditions.  Defaults to all validation groups
   */
  public validateQuery(queryConditions: Partial<TQueryConditions>, validationGroups: string[] = []) {
    validate(queryConditions, { skipMissingProperties: true, groups: validationGroups });
  }

  /**
   *
   * @param entity
   */ public validateEntity(entity: TEntity) {
    new this.model(entity).validate();
  }

  /**
   *
   * @param conditions
   */
  public async findOne(conditions: Partial<TQueryConditions>, useCache: boolean = true, ttl?: number): Promise<TEntity> {
    let key: string | undefined;
    this.loggerService.trace(`${this.name}.findOne`, conditions);

    this.validateQuery(conditions);

    if (useCache) {
      key = CachingUtils.makeCacheKeyFromObject(conditions);
      const cachedResult = await this.cacheStore.get<TEntity>(key);
      if (cachedResult) return cachedResult;
    }

    const result = await this.model.findOne(conditions);
    if (result == null) throw new AppError(`Could not find entity ${this.name} with conditions ${conditions}`);

    if (useCache) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, { ttl: ttl || this.defaultTTL });
    }

    return result;
  }

  /**
   *
   * @param conditions
   */
  public async find(conditions: Partial<TQueryConditions>, useCache: boolean = true, ttl?: number): Promise<TEntity[]> {
    let key: string | undefined;
    this.loggerService.trace(`${this.name}.find`, conditions);

    this.validateQuery(conditions);

    if (useCache) {
      key = CachingUtils.makeCacheKeyFromObject(conditions);
      const cachedResult = await this.cacheStore.get<TEntity[]>(key);
      if (cachedResult) return cachedResult;
    }

    const result = await this.model.find(conditions);

    if (useCache) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, { ttl: ttl || this.defaultTTL });
    }

    return result;
  }

  /**
   *
   * @param newEntity
   */
  public async create(newEntity: TEntity): Promise<TEntity> {
    this.loggerService.trace(`${this.name}.create`, newEntity);

    const createModel: TModel = new this.model();
    Object.assign(createModel, newEntity);
    return createModel.save();
  }

  /**
   *
   * @param partialEntity
   */
  public async patch(patchEntity: Partial<TEntity>): Promise<void> {
    this.loggerService.trace(`${this.name}.patch`, patchEntity);

    if (!patchEntity.id) throw new AppError(`${this.modelName} id can not be null`);

    let patchModel = await this.model.findById(patchEntity.id);
    if (!patchModel) throw new AppError(`No ${this.modelName} found with id ${patchEntity.id}`);

    patchModel = _.merge(patchModel, patchEntity);
    this.validateEntity(patchModel);

    await patchModel.save();

    this.clearCacheByEntity(patchModel);
  }

  /**
   *
   * @param entity
   */
  public async update(entity: TEntity): Promise<void> {
    this.loggerService.trace(`${this.name}.update`, entity);

    this.validateEntity(entity);
    // update. (at some point in the future, consider changing to findOneAndReplace... wasn't in typescript definitions for some reason)
    await this.model.findByIdAndUpdate(entity.id, entity, {}).exec();
    this.clearCacheByEntity(entity);
  }

  /**
   *
   * @param entityId
   */
  public async delete(conditions: Partial<TQueryConditions>): Promise<void> {
    this.loggerService.trace(`${this.name}.delete`, conditions);

    const deletedEntity = await this.model.findOneAndDelete(conditions).exec();
    this.clearCacheByEntity(deletedEntity);
  }

  /**
   *
   * @param cacheKey
   */
  protected async clearCacheByEntity(entity: TEntity | null) {
    if (!entity) throw new AppError('entity must not be null to trigger cache clear');
    this.validateEntity(entity);

    // clear by ID
    this.clearCacheByKey(CachingUtils.makeCacheKeyFromId(entity.id));

    // clear by query conditions
    this.generateValidQueryConditionsForCacheClear(entity).forEach(queryConditions => {
      this.clearCacheByKey(CachingUtils.makeCacheKeyFromObject(queryConditions));
    });
  }

  /**
   *
   * @param cacheKey
   */
  protected clearCacheByKey(cacheKey: string) {
    if (cacheKey.trim.length > 0) throw new AppError('cacheKey can not be null or whitespace');
    return this.cacheStore.del(cacheKey);
  }

  /**
   *
   * @param entity
   */
  protected abstract generateValidQueryConditionsForCacheClear(entity: TEntity): TQueryConditions[];
}
