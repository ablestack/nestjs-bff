import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseValidator } from './base.validator';

//
// Ensure that userId is set, unless this validation requirement is specifically overridden
//

@Injectable()
export class UserScopedValidator<TEntity extends IEntity> extends BaseValidator<TEntity> {
  constructor(loggerService: LoggerSharedService, entityType: { new (): TEntity }, coalesceType: boolean = true) {
    super(loggerService, entityType, coalesceType);
  }

  public async tryValidate(entity: Partial<TEntity>, validationGroups: string[] = []): Promise<ValidationError[]> {
    const validationErrors: ValidationError[] = [];

    entity = this.prepareEntityForValidation(entity);

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
