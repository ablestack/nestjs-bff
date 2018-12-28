import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
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
  entityRepoCache?: BaseRepoCache<TEntity, TModel, TQueryConditions>;
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
    this.entityRepoCache = params.entityRepoCache;

    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
  }

  /**
   *
   * @param entity
   */ public validate(entity: TEntity) {
    new this.model(entity).validate();
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
    this.validate(patchModel);

    await patchModel.save();

    this.triggerCacheClearById(patchModel.id);
  }

  /**
   *
   * @param entity
   */
  public async update(entity: TEntity): Promise<void> {
    this.loggerService.trace(`${this.name}.update`, entity);

    this.validate(entity);
    // update. (at some point in the future, consider changing to findOneAndReplace... wasn't in typescript definitions for some reason)
    await this.model.findByIdAndUpdate(entity.id, entity, {}).exec();
    this.triggerCacheClearById(entity.id);
  }

  /**
   *
   * @param entityId
   */
  public async delete(conditions: Partial<TQueryConditions>): Promise<void> {
    this.loggerService.trace(`${this.name}.delete`, entityId);

    let deleteModel = await this.entityRepoCache;

    await this.model.findOneAndDelete(conditions).exec();
    this.triggerCacheClearById(entityId);
  }

  protected async triggerCacheClearById(entityId?: string) {
    if (!entityId) throw new AppError('entityId can not be null');
    if (this.entityRepoCache) this.entityRepoCache.clearCacheById(entityId);
  }
}
