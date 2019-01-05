import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BaseValidator } from './base.validator';

//
// Ensure that orgId is set, unless this validation requirement is specifically overridden
//

@Injectable()
export class OrgScopedValidator<TEntity extends IEntity> extends BaseValidator<TEntity> {
  constructor(loggerService: LoggerSharedService) {
    super(loggerService);
  }

  public async tryValidate(entity: Partial<TEntity>, validationGroups: string[] = []): Promise<ValidationError[]> {
    const validationErrors: ValidationError[] = [];

    if (entity.hasOwnProperty('orgId') && !entity['orgId']) {
      const error = new ValidationError();
      error.constraints = { constraint: 'CustomIsRequired' };
      error.target = 'orgId';
      error.value = entity['orgId'];
      validationErrors.push(error);
    }

    return validationErrors;
  }
}
