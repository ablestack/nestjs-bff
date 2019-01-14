import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import { AuthCheckContract } from '../../../shared/authchecks/authcheck.contract';
import { CrudOperations } from '../../../shared/authchecks/crud-operations.enum';
import { ScopedEntityAuthCheck } from '../../../shared/authchecks/scoped-entity.authcheck';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingUtils } from '../../../shared/caching/caching.utils';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { ClassValidator } from '../validators/class-validator';

export interface IBaseRepoParams<TEntity extends IEntity, TModel extends Document & TEntity> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  cacheStore: CacheStore;
  defaultTTL: number;
  entityValidator: ClassValidator<TEntity>;
  entityAuthChecker?: AuthCheckContract<IEntity, CrudOperations>;
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
  public readonly entityAuthChecker: AuthCheckContract<IEntity, CrudOperations>;

  //
  // findOne
  //

  public async findOne(
    conditions: object,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    },
  ): Promise<TEntity> {
    const result = await this.tryFindOne(conditions, options);

    // validate not null
    if (!result) throw new AppError(`Could not find entity ${this.name} with conditions ${JSON.stringify(conditions)}`, options);

    // Return
    return result;
  }

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

  //
  // tryFindOne
  //

  public async tryFindOne(
    conditions: object,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    },
  ): Promise<TEntity | null> {
    // debug logging
    this.loggerService.debug(`${this.name}.findOne`, conditions, options);

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

    // cache population
    if (!options.skipCache === true && result && !cachedResult) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, { ttl: options.ttl || this.defaultTTL });
    }

    // authorization checks
    if (!options.skipAuthorization && result) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.name,
        targetResource: result,
        operation: CrudOperations.read,
      });
    }

    // Return
    return result;
  }

  //
  // find
  //

  public async find(
    conditions: object,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    },
  ): Promise<TEntity[]> {
    // debug logging
    this.loggerService.debug(`${this.name}.find`, conditions, options);

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
          await this.entityAuthChecker.ensureAuthorized({
            accessPermissions: options.accessPermissions,
            origin: this.name,
            targetResource: entity,
            operation: CrudOperations.read,
          });
        }
      }
    }

    // return
    return result;
  }

  //
  // create
  //

  public async create(
    newEntity: Partial<TEntity>,
    options?: { accessPermissions?: AccessPermissionsContract; skipAuthorization?: boolean; customValidator?: ClassValidator<TEntity> },
  ): Promise<TEntity> {
    // debug logging
    this.loggerService.debug(`${this.name}.create`, newEntity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    validator.validate(newEntity);

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.name,
        targetResource: newEntity,
        operation: CrudOperations.create,
      });
    }

    // transfer values to the model
    const createModel: TModel = new this.model();
    Object.assign(createModel, newEntity);

    // persist
    return this._dbSave(createModel);
  }

  //
  // patch
  //

  public async patch(
    patchEntity: Partial<TEntity>,
    options?: { accessPermissions?: AccessPermissionsContract; skipAuthorization?: boolean; customValidator?: ClassValidator<TEntity> },
  ): Promise<TEntity> {
    // debug logging
    this.loggerService.debug(`${this.name}.patch`, patchEntity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // partial validation
    validator.validate(patchEntity);

    // fetch entity
    let fullModel = await this._dbFindById(patchEntity._id);
    if (!fullModel) throw new AppError(`No ${this.modelName} found with id ${patchEntity._id}`);

    // merge values
    fullModel = _.merge(fullModel, patchEntity);

    // full validation
    await this.entityValidator.validate(fullModel);

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.name,
        targetResource: fullModel,
        operation: CrudOperations.update,
      });
    }

    // persist
    const savedFullModel = await this._dbSave(fullModel);

    // clear cache
    this.clearCacheByEntity(fullModel);

    return savedFullModel;
  }

  //
  // update
  //

  public async update(
    entity: TEntity,
    options?: { accessPermissions?: AccessPermissionsContract; skipAuthorization?: boolean; customValidator?: ClassValidator<TEntity> },
  ): Promise<TEntity> {
    // debug logging
    this.loggerService.debug(`${this.name}.update`, entity, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(entity, { skipMissingProperties: false });

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.name,
        targetResource: entity,
        operation: CrudOperations.update,
      });
    }

    // persist
    const savedReplacedModel = await this._dbFindOneAndReplace(entity);

    // clear cache
    this.clearCacheByEntity(savedReplacedModel);

    return savedReplacedModel;
  }

  //
  // delete
  //

  public async delete(
    id: string,
    options?: { accessPermissions?: AccessPermissionsContract; skipAuthorization?: boolean },
  ): Promise<TEntity | undefined> {
    // debug logging
    this.loggerService.debug(`${this.name}.delete`, id, options);

    // setup
    let deletedEntity;
    options = options || {}; // ensure options is not null

    // retrieve
    const deleteModel = await this._dbFindById(id);
    if (!deleteModel) throw new AppError(`No ${this.modelName} found with id ${id}`);

    // authorization checks
    if (!options.skipAuthorization && deleteModel) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.name,
        targetResource: deleteModel,
        operation: CrudOperations.delete,
      });
    }

    if (deleteModel) {
      // persist deletion
      deletedEntity = await this._dbRemove(deleteModel);

      // clear cache
      this.clearCacheByEntity(deletedEntity);
    }

    return deletedEntity;
  }

  //
  // utility methods
  //

  protected async clearCacheByEntity(entity: TEntity, options?: { customValidator?: ClassValidator<TEntity> }) {
    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(entity);

    // clear by ID
    this.clearCacheByKey(CachingUtils.makeCacheKeyFromId(entity._id));

    // clear by query conditions
    this.generateValidQueryConditionsForCacheClear(entity).forEach(cacheClearEntity => {
      this.clearCacheByKey(CachingUtils.makeCacheKeyFromObject(cacheClearEntity));
    });
  }

  protected clearCacheByKey(cacheKey: string) {
    if (cacheKey.trim.length > 0) throw new AppError('cacheKey can not be null or whitespace');
    return this.cacheStore.del(cacheKey);
  }

  protected abstract generateValidQueryConditionsForCacheClear(entity: TEntity): object[];

  //
  // Abstracted Mongoose calls, to allow for easier testing through mocked mongoose calls
  //
  protected async _dbFindOne(conditions: object) {
    this.loggerService.debug(`${this.name}._dbFindOne`, conditions);
    const result = await this.model.findOne(conditions).exec();
    return result;
  }

  protected async _dbFind(conditions: object): Promise<TModel[]> {
    this.loggerService.debug(`${this.name}._dbFind`, conditions);
    return this.model.find(conditions).exec();
  }

  protected async _dbSave(createModel: TModel): Promise<TModel> {
    this.loggerService.debug(`${this.name}._dbSave`, createModel);
    return createModel.save();
  }

  protected async _dbRemove(deleteModel: TModel): Promise<TModel> {
    this.loggerService.debug(`${this.name}._dbRemove`, deleteModel);
    return deleteModel.remove();
  }

  protected async _dbFindById(id: any): Promise<TModel | null> {
    this.loggerService.debug(`${this.name}._dbFindById`, id);
    return this.model.findById(id).exec();
  }

  protected async _dbFindOneAndReplace(entity: Partial<TEntity>) {
    this.loggerService.debug(`${this.name}._dbFindOneAndReplace`, entity);
    const result = await this.model.collection.findOneAndReplace({ _id: entity._id }, entity, { returnOriginal: false });
    return result.value;
  }
}
