import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BaseValidator } from './base.validator';
import { EntityValidator } from './entity.validator';
import { OrgScopedValidator } from './org-scoped.validator';
import { UserScopedValidator } from './user-scoped.validator';

//
// Ensure that userId is set, unless this validation requirement is specifically overridden
//

@Injectable()
export class ScopedValidator<TEntity extends IEntity> extends BaseValidator<TEntity> {
  private entityValidator: EntityValidator<TEntity>;
  private orgScopedValidator: OrgScopedValidator<TEntity>;
  private userScopedValidator: UserScopedValidator<TEntity>;

  // @ts-ignore
  constructor(loggerService: LoggerSharedService, entityType: { new (): TEntity }, coalesceType: boolean = true) {
    super(loggerService, entityType, coalesceType);

    // setup sub-validators
    this.entityValidator = new EntityValidator(loggerService, entityType, false);
    this.orgScopedValidator = new OrgScopedValidator(loggerService, entityType, false);
    this.userScopedValidator = new UserScopedValidator(loggerService, entityType, false);
  }

  /**
   *
   *
   * @param {Partial<TEntity>} entity
   * @param {string[]} [validationGroups=[]]
   * @returns {Promise<ValidationError[]>}
   * @memberof ScopedValidator
   */
  public async tryValidate(entity: Partial<TEntity>, validationGroups: string[] = []): Promise<ValidationError[]> {
    entity = this.prepareEntityForValidation(entity);

    const validationErrors: ValidationError[] = [
      ...(await this.entityValidator.tryValidate(entity, validationGroups)),
      ...(await this.orgScopedValidator.tryValidate(entity, validationGroups)),
      ...(await this.userScopedValidator.tryValidate(entity, validationGroups)),
    ];

    return validationErrors;
  }
}
