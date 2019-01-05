import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import _ = require('lodash');
import { AppError } from '../../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { IEntityValidator } from './entity-validator.interface';

//
// Ensure that userId is set, unless this validation requirement is specifically overridden
//

@Injectable()
export class EntityValidatorService<TEntity extends IEntity> implements IEntityValidator<TEntity> {
  constructor(private readonly loggerService: LoggerSharedService) {}

  public async validate(entity: Partial<TEntity>, validationGroups: string[] = []) {
    this.loggerService.trace(`EntityValidatorService.validate`, entity);

    const validationErrors = await this.validationTest(entity);

    if (validationErrors && validationErrors.length > 0) {
      throw new AppError(`Validation Failed`, { entity, errors: validationErrors });
    }
  }

  public async validationTest(entity: Partial<TEntity>): Promise<ValidationError[]> {
    const validationErrors: ValidationError[] = [];

    if (entity.hasOwnProperty('userId') && !entity['userId']) {
      const error = new ValidationError();
      error.constraints = { constraint: 'CustomIsRequired' };
      error.target = 'userId';
      error.value = entity['userId'];
      validationErrors.push(error);
    }

    return validationErrors;
  }
}
