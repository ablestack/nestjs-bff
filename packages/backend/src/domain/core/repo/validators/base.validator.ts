import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as _ from 'lodash';
import { AppError } from '../../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { IEntityValidator } from './entity-validator.interface';

@Injectable()
export abstract class BaseValidator<TEntity extends IEntity> implements IEntityValidator<TEntity> {
  constructor(
    protected readonly loggerService: LoggerSharedService,
    protected readonly entityType: { new (): TEntity },
    protected coalesceType: boolean = true,
  ) {}

  /**
   *
   *
   * @param {Partial<TEntity>} entity
   * @param {string[]} [validationGroups=[]]
   * @memberof BaseValidator
   */
  public async validate(entity: Partial<TEntity>, validationGroups: string[] = []) {
    this.loggerService.trace(`EntityValidatorService.validate`, entity);

    const validationErrors = await this.tryValidate(entity, validationGroups);

    if (validationErrors && validationErrors.length > 0) {
      throw new AppError(`Validation Failed`, { entity, errors: validationErrors });
    }
  }

  /**
   *
   *
   * @abstract
   * @param {Partial<TEntity>} entity
   * @param {string[]} validationGroups
   * @returns {Promise<ValidationError[]>}
   * @memberof BaseValidator
   */
  abstract async tryValidate(entity: Partial<TEntity>, validationGroups: string[]): Promise<ValidationError[]>;

  /**
   *
   * @param entity
   */
  protected prepareEntityForValidation(entity: Partial<TEntity>) {
    if (!this.coalesceType) return entity;

    // ensure the object has the relevant attributes - as typescript has structural typing, not nominal typing
    const entityWithAttributes: TEntity = new this.entityType();
    _.merge(entityWithAttributes, entity);

    return entityWithAttributes;
  }
}
