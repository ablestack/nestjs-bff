import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { OrgAuthorizationQueryValidator } from './validators/org-authorization-query-validator.interface.1';
import { IRepoValidator, IValidatorOptions } from './validators/repo-validator.interface';
import { UserAuthorizationQueryValidator } from './validators/user-authorization-query-validator.interface';

export interface IBaseRepoReadOptions<TEntity extends object & IEntity, TModel extends Document & TEntity> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
  queryValidator?: Array<IRepoValidator<any, any>>;
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
  protected readonly queryValidator?: Array<IRepoValidator<any, any>>;

  /**
   *
   * @param options
   */
  constructor(options: IBaseRepoReadOptions<TEntity, TModel>) {
    this.loggerService = options.loggerService;
    this.model = options.model;

    // Defaults to authorization validator, unless overridden
    if (options.queryValidator !== undefined) {
      this.queryValidator = options.queryValidator;
    } else {
      this.queryValidator = [new OrgAuthorizationQueryValidator(), new UserAuthorizationQueryValidator()];
    }

    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
  }

  /**
   *
   * @param conditions
   * @param validatorOptions
   */
  public async findOne(conditions: Partial<TEntity>, validatorOptions?: IValidatorOptions): Promise<TEntity | null> {
    this.loggerService.trace(`${this.name}.findOne`, conditions);

    // validate
    if (this.queryValidator) {
      this.queryValidator.forEach(element => {
        element.validate(conditions, validatorOptions);
      });
    }

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
   */ public async find(conditions: Partial<TEntity>, validatorOptions?: IValidatorOptions): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.find`, conditions);

    // validate
    if (this.queryValidator) {
      this.queryValidator.forEach(element => {
        element.validate(conditions, validatorOptions);
      });
    }

    // execute
    return this.model.find(conditions);
  }
}
