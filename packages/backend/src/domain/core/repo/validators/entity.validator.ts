import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import * as _ from 'lodash';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BaseValidator } from './base.validator';

@Injectable()
export class EntityValidator<TEntity extends IEntity> extends BaseValidator<TEntity> {
  constructor(loggerService: LoggerSharedService, entityType: { new (): TEntity }, coalesceType: boolean = true) {
    super(loggerService, entityType, coalesceType);
  }

  public async tryValidate(entity: Partial<TEntity>, validationGroups: string[] = []): Promise<ValidationError[]> {
    entity = this.prepareEntityForValidation(entity);

    const validationErrors = await validate(entity, {
      skipMissingProperties: true,
      groups: validationGroups,
    });

    return validationErrors;
  }
}
