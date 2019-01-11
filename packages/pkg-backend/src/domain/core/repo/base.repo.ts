import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingUtils } from '../../../shared/caching/caching.utils';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { AuthCheckContract } from '../authchecks/authcheck.contract';
import { ScopedEntityAuthCheck } from '../authchecks/scoped-entity.authcheck';
import { ClassValidator } from '../validators/class-validator';

export interface IBaseRepoParams<TEntity extends IEntity, TModel extends Document & TEntity> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  cacheStore: CacheStore;
  defaultTTL: number;
  entityValidator: ClassValidator<TEntity>;
  entityAuthChecker?: AuthCheckContract<IEntity>;
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
  public readonly entityValidator: ClassValidator<TEntity>;
  public readonly entityAuthChecker: AuthCheckContract<IEntity>;

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
      credentials?: UserCredentialsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    },
  ): Promise<TEntity> {
    // trace logging
    this.loggerService.trace(`${this.name}.findOne`, conditions, options);

    // Setup
    let key: string | undefined;
    let result: TEntity | null;
    let cachedResult: TEntity | null | undefined;

    options = options || {}; // ensure options is not null

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
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized(options.credentials, result);
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
      credentials?: UserCredentialsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    },
  ): Promise<TEntity[]> {
    // trace logging
    this.loggerService.trace(`${this.name}.find`, conditions, options);

    // setup
    let key: string | undefined;
    let result: TEntity[] | null;
    let cachedResult: TEntity[] | null | undefined;
    options = options || {}; // ensure options is not null

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
        if (!options.skipAuthorization) {
          await this.entityAuthChecker.ensureAuthorized(options.credentials, entity);
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
    options?: { credentials?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: ClassValidator<TEntity> },
  ): Promise<TEntity> {
    // trace logging
    this.loggerService.trace(`${this.name}.create`, newEntity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    validator.validate(newEntity);

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized(options.credentials, newEntity);
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
    options?: { credentials?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: ClassValidator<TEntity> },
  ): Promise<TEntity> {
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
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized(options.credentials, fullModel);
    }

    // persist
    const savedFullModel = await this._dbSave(fullModel);

    // clear cache
    this.clearCacheByEntity(fullModel);

    return savedFullModel;
  }

  /**
   *
   * @param entity
   */
  public async update(
    entity: TEntity,
    options?: { credentials?: UserCredentialsContract; skipAuthorization?: boolean; customValidator?: ClassValidator<TEntity> },
  ): Promise<TEntity> {
    // trace logging
    this.loggerService.trace(`${this.name}.update`, entity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(entity, { skipMissingProperties: false });

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized(options.credentials, entity);
    }

    // persist
    const savedReplacedModel = await this._dbFindOneAndReplace(entity);

    // clear cache
    this.clearCacheByEntity(savedReplacedModel);

    return savedReplacedModel;
  }

  /**
   *
   * @param entityId
   */
  public async delete(id: string, options?: { credentials?: UserCredentialsContract; skipAuthorization?: boolean }): Promise<TEntity | undefined> {
    // trace logging
    this.loggerService.trace(`${this.name}.delete`, id, options);

    // setup
    let deletedEntity;
    options = options || {}; // ensure options is not null

    // retrieve
    const deleteModel = await this._dbFindById(id);
    if (!deleteModel) throw new AppError(`No ${this.modelName} found with id ${id}`);

    // authorization checks
    if (!options.skipAuthorization && deleteModel) {
      await this.entityAuthChecker.ensureAuthorized(options.credentials, deleteModel);
    }

    if (deleteModel) {
      // persist deletion
      deletedEntity = await this._dbRemove(deleteModel);

      // clear cache
      this.clearCacheByEntity(deletedEntity);
    }

    return deletedEntity;
  }

  /**
   *
   * @param cacheKey
   */
  protected async clearCacheByEntity(entity: TEntity, options?: { customValidator?: ClassValidator<TEntity> }) {
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

  protected async _dbFindOneAndReplace(conditions: Partial<TEntity>) {
    // @ts-ignore
    return this.model.findOneAndReplace(conditions).exec();
  }
}
