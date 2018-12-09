import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from './base.repo-cache';
import { IValidator } from './validator.interface';
/**
 *
 * @property loggerService
 * @property model
 * @property entityCache optional. Provide for automatic cache clears
 * @property createValidator optional. Provide with entity-create validation logic
 * @property updateValidator optional. Provide with entity-update validation logic
 * @property deleteValidator optional. Provide with entity-delete validation logic
 */
export interface IBaseRepoWriteOptions<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity
> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  entityRepoCache?: BaseRepoCache<TEntity, TModel>;
  createValidator?: IValidator<TEntity, any>;
  updateValidator?: IValidator<Partial<TEntity>, any>;
  deleteValidator?: IValidator<TEntity, any>;
}

export abstract class BaseRepoWrite<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity
> {
  protected readonly _loggerService: LoggerSharedService;
  protected readonly _model: Model<TModel>;
  protected readonly entityRepoCache?: BaseRepoCache<TEntity, TModel>;
  protected readonly createValidator?: IValidator<TEntity, TModel>;
  protected readonly updateValidator?: IValidator<Partial<TEntity>, TModel>;
  protected readonly deleteValidator?: IValidator<TEntity, TModel>;
  public readonly modelName: string;

  constructor(repoOptions: IBaseRepoWriteOptions<TEntity, TModel>) {
    this._loggerService = repoOptions.loggerService;
    this._model = repoOptions.model;
    this.entityRepoCache = repoOptions.entityRepoCache;
    this.updateValidator = repoOptions.updateValidator;
    this.deleteValidator = repoOptions.deleteValidator;

    this.modelName = this._model.modelName;
  }

  public async create(newEntity: TEntity): Promise<TEntity> {
    // entity validation
    if (this.createValidator) this.createValidator.validate(newEntity);

    const createModel: TModel = new this._model();
    Object.assign(createModel, newEntity);
    return createModel.save();
  }

  public async update(updateEntity: Partial<TEntity>): Promise<TEntity> {
    // field validation
    if (!updateEntity.id)
      throw new AppError(`${this.modelName} id can not be null`);

    // entity validation
    if (this.updateValidator) this.updateValidator.validate(updateEntity);

    // get current entity from DB
    const updateModel = await this._model.findById(updateEntity.id);
    if (!updateModel)
      throw new AppError(
        `No ${this.modelName} found with id ${updateEntity.id}`,
      );

    // update values
    const updatedModel = _.merge(updateModel, updateEntity);

    // Persist
    const result = await updatedModel.save();

    this.triggerCacheClear(result);

    return result;
  }

  public async delete(entityId: string): Promise<TEntity> {
    // get current entity from DB
    const deleteModel = await this._model.findById(entityId);
    if (!deleteModel)
      throw new AppError(`No ${this.modelName} found with id ${entityId}`);

    // entity validation
    if (this.deleteValidator) this.deleteValidator.validate(deleteModel);

    const result = await deleteModel.remove();

    this.triggerCacheClear(result);

    return result;
  }

  protected async triggerCacheClear(entity: TEntity) {
    if (this.entityRepoCache) return this.entityRepoCache.clear(entity);
    return null;
  }
}
