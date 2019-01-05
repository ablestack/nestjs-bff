import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import _ = require('lodash');
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BaseValidator } from './base.validator';

@Injectable()
export class EntityValidator<TEntity extends IEntity> extends BaseValidator<TEntity> {
  constructor(loggerService: LoggerSharedService, private readonly entityType: { new (): TEntity }) {
    super(loggerService);
  }

  public async tryValidate(entity: Partial<TEntity>, validationGroups: string[] = []): Promise<ValidationError[]> {
    // ensure the object has the relevant attributes
    const entityWithAttributes: TEntity = new this.entityType();
    _.merge(entityWithAttributes, entity);

    const validationErrors = await validate(entityWithAttributes, {
      skipMissingProperties: true,
      groups: validationGroups,
    });

    return validationErrors;
  }
}
