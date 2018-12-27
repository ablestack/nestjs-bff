import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { validate } from 'class-validator';
import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoCache } from './base.repo-cache';

export abstract class BaseRepoWrite<TEntity extends object & IEntity, TModel extends Document & TEntity> {
  private readonly name: string;
  public readonly modelName: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;

  protected readonly entityRepoCache?: BaseRepoCache<TEntity, TModel>;

  constructor(loggerService: LoggerSharedService, model: Model<TModel>) {
    this.loggerService = loggerService;
    this.model = model;

    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
  }

  /**
   *
   *
   * @param {TQueryConditions} queryConditions
   * @param {string[]} [validationGroups=[]]
   * @memberof BaseRepoRead
   * @description Validates query conditions.  Defaults to all validation groups
   */
  public validate(entity: Partial<TEntity>, skipMissingProperties: boolean = false, validationGroups: string[] = []) {
    validate(entity, { skipMissingProperties, groups: validationGroups });
  }

  public async create(newEntity: TEntity): Promise<TEntity> {
    const createModel: TModel = new this.model();
    Object.assign(createModel, newEntity);
    return createModel.save();
  }

  public async patch(entity: Partial<TEntity>): Promise<TEntity> {
    // validate
    this.validate(entity, true);

    // get current entity from DB
    const updateModel = await this.model.findById(entity.id);
    if (!updateModel) throw new AppError(`No ${this.modelName} found with id ${entity.id}`);

    // update values
    const updatedModel = _.merge(updateModel, entity);

    // Persist
    const result = await updatedModel.save();

    this.triggerCacheClear(result);

    return result;
  }

  public async update(entity: TEntity): Promise<TEntity> {
    // validate
    this.validate(entity, false);

    IN; progress;...

    // update. (at some point in the future, consider changing to findOneAndReplace... wasn't in typescript definitions for some reason)
    this.model.findOneAndUpdate({ _id: entity.id }, entity, { new: true });

    // get current entity from DB
    const updateModel = await this.model.findById(entity.id);
    if (!updateModel) throw new AppError(`No ${this.modelName} found with id ${entity.id}`);

    // update values
    updateModel.set(entity);

    // Persist
    const result = await updatedModel.save();

    this.triggerCacheClear(result);

    return result;
  }

  public async delete(entityId: string): Promise<TEntity> {
    // get current entity from DB
    const deleteModel = await this.model.findById(entityId);
    if (!deleteModel) throw new AppError(`No ${this.modelName} found with id ${entityId}`);

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
