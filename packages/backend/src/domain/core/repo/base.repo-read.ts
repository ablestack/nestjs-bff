import { IEntity } from '@nestjs-bff/universal/interfaces/entity.interface';
import { Document, Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';

export interface IBaseRepoReadOptions<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity
> {
  loggerService: LoggerSharedService;
  model: Model<TModel>;
}

export abstract class BaseRepoRead<
  TEntity extends object & IEntity,
  TModel extends Document & TEntity
> {
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

  public async findAll(): Promise<TEntity[]> {
    this.loggerService.trace(`${this.name}.findById`);
    return this.model.find().exec();
  }
}
