import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import _ = require('lodash');
import { AppError } from '../../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { IEntityValidator } from './entity-validator.interface';

@Injectable()
export class EntityValidatorService<TEntity extends IEntity> implements IEntityValidator<TEntity> {
  constructor(private readonly loggerService: LoggerSharedService, private readonly entityType: { new (): TEntity }) {}

  public async validate(entity: Partial<TEntity>, validationGroups: string[] = []) {
    this.loggerService.trace(`EntityValidatorService.validate`, entity);

    // ensure the object has the relevant attributes
    const entityWithAttributes: TEntity = new this.entityType();
    _.merge(entityWithAttributes, entity);

    // this.loggerService.debug('EntityValidatorService - entities', { entityWithAttributes, entity });

    const validationErrors = await validate(entityWithAttributes, {
      skipMissingProperties: true,
      groups: validationGroups,
    });

    //
    // Ensure that userId is set, unless this validation requirement is specifically overridden
    //
    if (entityWithAttributes.hasOwnProperty('userId') && !entityWithAttributes['userId']) {
      const error = new ValidationError();
      error.constraints = { constraint: 'CustomIsRequired' };
      error.target = 'userId';
      error.value = entityWithAttributes['userId'];
      validationErrors.push(error);
    }

    //
    // Ensure that orgId is set, unless this validation requirement is specifically overridden
    //
    if (entityWithAttributes.hasOwnProperty('orgId') && !entityWithAttributes['orgId']) {
      const error = new ValidationError();
      error.constraints = { constraint: 'CustomIsRequired' };
      error.target = 'orgId';
      error.value = entityWithAttributes['orgId'];
      validationErrors.push(error);
    }

    if (validationErrors && validationErrors.length > 0) {
      throw new AppError(`Validation Failed`, { entity, errors: validationErrors });
    }
  }
}
