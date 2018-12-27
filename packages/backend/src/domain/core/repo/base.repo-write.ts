import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { validate } from 'class-validator';
import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseQueryConditions } from './base.query-conditions';
import { BaseRepoCache } from './base.repo-cache';

export interface IBaseRepoWriteParams<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
}
export abstract class BaseRepoWrite<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  private readonly name: string;
  public readonly modelName: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;

  protected readonly entityRepoCache?: BaseRepoCache<TEntity, TModel, TQueryConditions>;

  constructor(params: IBaseRepoWriteParams<TEntity, TModel, TQueryConditions>) {
    this.loggerService = params.loggerService;
    this.model = params.model;

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

  /**
   *
   * @param newEntity
   */
  public async create(newEntity: TEntity): Promise<TEntity> {
    const createModel: TModel = new this.model();
    Object.assign(createModel, newEntity);
    return createModel.save();
  }

  /**
   *
   * @param entity
   */
  public async patch(entity: Partial<TEntity>): Promise<void> {
    this.validate(entity, true);

    await this.model.findByIdAndUpdate(entity.id, entity, {}).exec();

    this.triggerCacheClearById(entity.id);
  }

  /**
   *
   * @param entity
   */
  public async update(entity: TEntity): Promise<void> {
    this.validate(entity, false);

    // update. (at some point in the future, consider changing to findOneAndReplace... wasn't in typescript definitions for some reason)
    await this.model.findByIdAndUpdate(entity.id, entity, {}).exec();

    this.triggerCacheClearById(entity.id);
  }

  /**
   *
   * @param entityId
   */
  public async delete(entityId: string): Promise<void> {
    await this.model.findByIdAndDelete(entityId).exec();

    this.triggerCacheClearById(entityId);
  }

  protected async triggerCacheClearById(entityId?: string) {
    if (!entityId) throw new AppError('entityId can not be null');
    if (this.entityRepoCache) this.entityRepoCache.clearCacheById(entityId);
  }
}
