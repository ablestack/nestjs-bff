import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Document, Model } from 'mongoose';
import { AppError } from '../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';

export interface IBaseRepoReadOptions<TEntity extends object & IEntity, TModel extends Document & TEntity> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
}

export abstract class BaseRepoRead<TEntity extends object & IEntity, TModel extends Document & TEntity> {
  private readonly name: string;
  public readonly modelName: string;
  protected readonly loggerService: LoggerSharedService;
  protected readonly model: Model<TModel>;

  constructor(options: IBaseRepoReadOptions<TEntity, TModel>) {
    this.loggerService = options.loggerService;
    this.model = options.model;

    this.name = `RepoBase<${this.model.modelName}>`;
    this.modelName = this.model.modelName;
  }

  public async findById(id: string): Promise<TEntity | null> {
    this.loggerService.trace(`${this.name}.findById`, { id });
    return this.model.findById(id).exec();
  }

  public async findOneById(id: string): Promise<TEntity> {
    return this.model
      .findById(id)
      .exec()
      .then(result => {
        if (result == null) throw new AppError(`Could not find entity ${this.name} with id ${id}`);
        return result;
      });
  }

  public async findAll(): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.findById`);
    return this.model.find().exec();
  }
}
