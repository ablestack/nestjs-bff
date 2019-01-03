import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import _ = require('lodash');
import { AppError } from '../../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { IEntityValidator } from './entity-validator.interface';

@Injectable()
export class EntityValidatorService implements IEntityValidator {
  constructor(private readonly loggerService: LoggerSharedService, private readonly entityType:  { new (): IEntity } ) {}

  public async validate(entity: Partial<IEntity>, validationGroups: string[] = []) {
    this.loggerService.trace(`EntityValidatorService.validate`, entity);

    // ensure the object has the relevant attributes
    const entityWithAttributes: IEntity = new this.entityType();
    _.merge(entityWithAttributes, entity);

    this.loggerService.debug(`validateQuery`, { entity, entityWithAttributes });

    const validationErrors = await validate(entityWithAttributes, {
      skipMissingProperties: true,
      groups: validationGroups,
    });

    if (validationErrors && validationErrors.length > 0) {
      throw new AppError(`Validation Failed`, { entity, errors: validationErrors });
    }
  }
}
