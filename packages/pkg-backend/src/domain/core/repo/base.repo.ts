import { ValidationGroups } from '@nestjs-bff/global/lib/entities/core/core.constants';
import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingUtils } from '../../../shared/caching/caching.utils';
import { AppError } from '../../../shared/exceptions/app.exception';
import { UnauthorizedError } from '../../../shared/exceptions/unauthorized.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { EntityAuthCheckContract } from '../authchecks/entity-authcheck.contract';
import { ScopedEntityAuthCheck } from '../authchecks/scoped-entity.authcheck';
import { IEntityValidator } from '../validators/entity-validator.interface';

export interface IBaseRepoParams<TEntity extends IEntity, TModel extends Document & TEntity> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  cacheStore: CacheStore;
  defaultTTL: number;
  entityValidator: IEntityValidator<TEntity>;
  entityAuthChecker?: EntityAuthCheckContract;
}

/**
 * Base repo query repository
 *
 * Notes:
 *  - By default will try to validate that org and user filtering in in place, unless overridden with params
 *  - FindAll can be achieved with find, passing no conditions
 */
export abstract class BaseRepo<TEntity extends IEntity, TModel extends Document & TEntity> {
  private readonly name: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;
  protected readonly cacheStore: CacheStore;
  protected readonly defaultTTL: number;
  public readonly modelName: string;
  public readonly entityValidator: IEntityValidator<TEntity>;
  public readonly entityAuthChecker: EntityAuthCheckContract;

  /**
   *
   * @param options
   */
  constructor(params: IBaseRepoParams<TEntity, TModel>) {
    this.loggerService = params.loggerService;
    this.model = params.model;
    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
    this.cacheStore = params.cacheStore;
    this.defaultTTL = params.defaultTTL;
    this.entityValidator = params.entityValidator;
    this.entityAuthChecker = params.entityAuthChecker || new ScopedEntityAuthCheck();
  }

  /**
   *
   * @param conditions
   */
  public async findOne(
    conditions: Partial<TEntity>,
    options?: {
      authorization?: UserCredentialsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
      customValidator?: IEntityValidator<TEntity>;
    },
  ): Promise<TEntity> {
    // trace logging
    this.loggerService.trace(`${this.name}.findOne`, conditions, options);

    // Setup
    let key: string | undefined;
    let result: TEntity | null;
    let cachedResult: TEntity | null | undefined;

    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(conditions, [ValidationGroups.QUERY_REQUIRED]);

    // cache access
    if (!options.skipCache === true) {
      key = CachingUtils.makeCacheKeyFromObject(conditions);
      cachedResult = await this.cacheStore.get<TEntity>(key);
    }

    if (cachedResult) {
      result = cachedResult;
    } else {
      // data store access
      result = await this._dbFindOne(conditions);
    }

    // validate not null
    if (result == null) throw new AppError(`Could not find entity ${this.name} with conditions ${conditions}`);

    // cache population
    if (!options.skipCache === true && result && !cachedResult) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, { ttl: options.ttl || this.defaultTTL });
    }

    // authorization checks
    if (!options.skipAuthorization && result && !(await this.entityAuthChecker.isAuthorized(options.authorization, result))) {
      throw new UnauthorizedError(`Not Authorized`);
    }

    // Return
    return result;
  }

  /**
   *
   * @param conditions
   */
  public async find(
    conditions: Partial<TEntity>,
    options?: {
      authorization?: UserCredentialsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
      customValidator?: IEntityValidator<TEntity>;
    },
  ): Promise<TEntity[]> {
    // trace logging
    this.loggerService.trace(`${this.name}.find`, conditions, options);

    // setup
    let key: string | undefined;
    let result: TEntity[] | null;
    let cachedResult: TEntity[] | null | undefined;
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(conditions, [ValidationGroups.QUERY_REQUIRED]);

    // cache access
    if (!options.skipCache === true) {
      key = CachingUtils.makeCacheKeyFromObject(conditions);
      cachedResult = await this.cacheStore.get<TEntity[]>(key);
    }

    if (cachedResult) {
      result = cachedResult;
    } else {
      // data store access
      result = await this._dbFind(conditions);
    }

    // cache population
    if (!options.skipCache === true && result && !cachedResult) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, { ttl: options.ttl || this.defaultTTL });
    }

    // authorization checks
    if (!options.skipAuthorization && result) {
      for (const entity of result) {
        if (!(await this.entityAuthChecker.isAuthorized(options.authorization, entity))) {
          throw new UnauthorizedError(`Not Authorized`);
        }
      }
    }

    // return
    return result;
  }

  /**
   *
   * @param newEntity
   */
  public async create(
    newEntity: TEntity,
    options?: { authorization?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: IEntityValidator<TEntity> },
  ): Promise<TEntity> {
    // trace logging
    this.loggerService.trace(`${this.name}.create`, newEntity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    validator.validate(newEntity);

    // authorization checks
    if (!options.skipAuthorization && newEntity && !(await this.entityAuthChecker.isAuthorized(options.authorization, newEntity))) {
      throw new UnauthorizedError(`Not Authorized`);
    }

    // transfer values to the model
    const createModel: TModel = new this.model();
    Object.assign(createModel, newEntity);

    // persist
    return this._dbSave(createModel);
  }

  /**
   *
   * @param partialEntity
   */
  public async patch(
    patchEntity: Partial<TEntity>,
    options?: { authorization?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: IEntityValidator<TEntity> },
  ): Promise<void> {
    // trace logging
    this.loggerService.trace(`${this.name}.patch`, patchEntity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // partial validation
    validator.validate(patchEntity);

    // fetch entity
    let fullModel = await this._dbFindById(patchEntity.id);
    if (!fullModel) throw new AppError(`No ${this.modelName} found with id ${patchEntity.id}`);

    // merge values
    fullModel = _.merge(fullModel, patchEntity);

    // full validation
    await this.entityValidator.validate(fullModel);

    // authorization checks
    if (!options.skipAuthorization && fullModel && !(await this.entityAuthChecker.isAuthorized(options.authorization, fullModel))) {
      throw new UnauthorizedError(`Not Authorized`);
    }

    // persist
    await this._dbSave(fullModel);

    // clear cache
    this.clearCacheByEntity(fullModel);
  }

  /**
   *
   * @param entity
   */
  public async update(
    entity: TEntity,
    options?: { authorization?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: IEntityValidator<TEntity> },
  ): Promise<void> {
    // trace logging
    this.loggerService.trace(`${this.name}.update`, entity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(entity);

    // persist. (at some point in the future, consider changing to findOneAndReplace... wasn't in typescript definitions for some reason)
    const model = await this._dbFindById(entity.id);

    // authorization checks
    if (!options.skipAuthorization && model && !(await this.entityAuthChecker.isAuthorized(options.authorization, model))) {
      throw new UnauthorizedError(`Not Authorized`);
    }

    // clear cache
    this.clearCacheByEntity(entity);
  }

  /**
   *
   * @param entityId
   */
  public async delete(
    conditions: Partial<TEntity>,
    options?: { authorization?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: IEntityValidator<TEntity> },
  ): Promise<TEntity | undefined> {
    // trace logging
    this.loggerService.trace(`${this.name}.delete`, conditions, options);

    // setup
    let deletedEntity;
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(conditions, [ValidationGroups.QUERY_REQUIRED]);

    // retrieve
    const model = await this._dbFindOne(conditions);

    // authorization checks
    if (!options.skipAuthorization && model && !(await this.entityAuthChecker.isAuthorized(options.authorization, model))) {
      throw new UnauthorizedError(`Not Authorized`);
    }

    if (model) {
      // persist
      deletedEntity = await this._dbRemove(model);

      // clear cache
      this.clearCacheByEntity(deletedEntity);
    }

    return deletedEntity;
  }

  /**
   *
   * @param cacheKey
   */
  protected async clearCacheByEntity(entity: TEntity, options?: { customValidator?: IEntityValidator<TEntity> }) {
    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(entity);

    // clear by ID
    this.clearCacheByKey(CachingUtils.makeCacheKeyFromId(entity.id));

    // clear by query conditions
    this.generateValidQueryConditionsForCacheClear(entity).forEach(cacheClearEntity => {
      this.clearCacheByKey(CachingUtils.makeCacheKeyFromObject(cacheClearEntity));
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
  protected abstract generateValidQueryConditionsForCacheClear(entity: TEntity): Array<Partial<TEntity>>;

  //
  // Abstracted Mongoose calls, to allow for easier testing through mocked mongoose calls
  //
  protected async _dbFindOne(conditions: Partial<TEntity>) {
    return this.model.findOne(conditions).exec();
  }

  protected async _dbFind(conditions: Partial<TEntity>): Promise<TModel[]> {
    return this.model.find(conditions).exec();
  }

  protected async _dbSave(createModel: TModel): Promise<TModel> {
    return createModel.save();
  }

  protected async _dbRemove(deleteModel: TModel): Promise<TModel> {
    return deleteModel.remove();
  }

  protected async _dbFindById(id: any): Promise<TModel | null> {
    return this.model.findById(id).exec();
  }
}
