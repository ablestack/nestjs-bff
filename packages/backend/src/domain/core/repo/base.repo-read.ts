import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { validate } from 'class-validator';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseQueryConditions } from './base.query-conditions';

export interface IBaseRepoReadParams<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
}

/**
 * Base repo query repository
 *
 * Notes:
 *  - By default will try to validate that org and user filtering in in place, unless overridden with params
 *  - FindAll can be achieved with find, passing no conditions
 */
export abstract class BaseRepoRead<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity,
  TQueryConditions extends BaseQueryConditions
> {
  private readonly name: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;
  public readonly modelName: string;

  /**
   *
   * @param options
   */
  constructor(params: IBaseRepoReadParams<TEntity, TModel, TQueryConditions>) {
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
  public validate(queryConditions: Partial<TQueryConditions>, validationGroups: string[] = []) {
    validate(queryConditions, { skipMissingProperties: true, groups: validationGroups });
  }

  /**
   *
   * @param conditions
   * @param validatorOptions
   */
  public async findOne(conditions: Partial<TQueryConditions>): Promise<TEntity | null> {
    this.loggerService.trace(`${this.name}.findOne`, conditions);

    // validate
    this.validate(conditions);

    // execute
    return this.model.findOne(conditions).then(result => {
      if (result == null) throw new AppError(`Could not find entity ${this.name} with conditions ${conditions}`);
      return result;
    });
  }

  /**
   *
   * @param conditions
   * @param validatorOptions
   */ public async find(conditions: Partial<TQueryConditions>): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.find`, conditions);

    // validate
    this.validate(conditions);

    // execute
    return this.model.find(conditions);
  }
}
