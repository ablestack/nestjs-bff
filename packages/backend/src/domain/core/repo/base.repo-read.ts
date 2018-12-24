import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { OrgAndUserAuthorizationQueryValidator } from './validators/org-and-user-authorization-query-validator.interface';
import { IRepoValidator } from './validators/repo-validator.interface';

export interface IBaseRepoReadOptions<TEntity extends object & IEntity, TModel extends Document & TEntity> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  queryValidator?: IRepoValidator<any, any>;
}

/**
 * Base repo query repository
 *
 * Notes:
 *  - By default will try to validate that org and user filtering in in place, unless overridden with options
 *  - FindAll can be achieved with find, passing no conditions
 */
export abstract class BaseRepoRead<TEntity extends object & IEntity, TModel extends Document & TEntity> {
  private readonly name: string;
  public readonly modelName: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;
  protected readonly queryValidator?: IRepoValidator<any, any> = new OrgAndUserAuthorizationQueryValidator(); // Defaults to authorization validator, unless overridden

  constructor(options: IBaseRepoReadOptions<TEntity, TModel>) {
    this.loggerService = options.loggerService;
    this.model = options.model;
    if (options.queryValidator !== undefined) this.queryValidator = options.queryValidator; // Defaults to authorization validator, unless overridden

    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
  }

  public async findOne(conditions: Partial<TEntity>): Promise<TEntity | null> {
    this.loggerService.trace(`${this.name}.findOne`, conditions);

    if (this.queryValidator) this.queryValidator.validate(conditions);

    return this.model.findOne(conditions).then(result => {
      if (result == null) throw new AppError(`Could not find entity ${this.name} with conditions ${conditions}`);
      return result;
    });
  }

  public async find(conditions: Partial<TEntity>): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.find`, conditions);

    if (this.queryValidator) this.queryValidator.validate(conditions);

    return this.model.find(conditions);
  }
}
