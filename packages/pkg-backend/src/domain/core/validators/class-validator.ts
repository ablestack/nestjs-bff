import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import * as _ from 'lodash';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';

@Injectable()
export class ClassValidator<T> {
  constructor(protected readonly loggerService: LoggerSharedService, protected readonly entityType: { new (): T }, protected coalesceType: boolean = true) {}

  public async validate(obj: Partial<T>, options?: ValidationOptions): Promise<void> {
    this.loggerService.trace(`EntityValidatorService.validate`, obj);

    const validationError = await this.tryValidate(obj, options);

    if (validationError) {
      throw validationError;
    }
  }

  public async tryValidate(obj: Partial<T>, options?: ValidationOptions): Promise<ValidationError | null> {
    options = options || {};
    let validationError: ValidationError | null = null;

    // prepare class
    obj = this.prepareClassForValidation(obj);

    // validate
    const classValidatorValidationErrors = await validate(obj, {
      skipMissingProperties: options.skipMissingProperties !== undefined ? options.skipMissingProperties : true,
      groups: options.validationGroups || [],
    });

    // if validation errors, create Exception object
    if (classValidatorValidationErrors && classValidatorValidationErrors.length > 0) {
      const validationErrorMessages: string[] = [];
      classValidatorValidationErrors.forEach(valErr => {
        validationErrorMessages.push(`Property '${valErr.property}' can not contain value '${valErr.value}'`);
      });
      validationError = new ValidationError(validationErrorMessages, classValidatorValidationErrors);
    }

    // return exception object
    return validationError;
  }

  protected prepareClassForValidation(obj: Partial<T>) {
    if (!this.coalesceType) return obj;

    // ensure the object has the relevant attributes - as typescript has structural typing, not nominal typing
    const entityWithAttributes: T = new this.entityType();
    _.merge(entityWithAttributes, obj);

    return entityWithAttributes;
  }
}

export class ValidationOptions {
  validationGroups?: string[];
  skipMissingProperties?: boolean;
}
