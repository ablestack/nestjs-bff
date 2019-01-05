import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppError } from '../../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { IEntityValidator } from './entity-validator.interface';

@Injectable()
export abstract class BaseValidator<TEntity extends IEntity> implements IEntityValidator<TEntity> {
  constructor(protected readonly loggerService: LoggerSharedService) {}

  public async validate(entity: Partial<TEntity>, validationGroups: string[] = []) {
    this.loggerService.trace(`EntityValidatorService.validate`, entity);

    const validationErrors = await this.tryValidate(entity, validationGroups);

    if (validationErrors && validationErrors.length > 0) {
      throw new AppError(`Validation Failed`, { entity, errors: validationErrors });
    }
  }

  abstract async tryValidate(entity: Partial<TEntity>, validationGroups: string[]): Promise<ValidationError[]>;
}
