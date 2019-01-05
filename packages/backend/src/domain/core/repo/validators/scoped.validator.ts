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

  constructor(loggerService: LoggerSharedService, private readonly entityType: { new (): TEntity }) {
    super(loggerService);

    this.entityValidator = new EntityValidator(loggerService, entityType);
    this.orgScopedValidator = new OrgScopedValidator(loggerService);
    this.userScopedValidator = new UserScopedValidator(loggerService);
  }

  public async tryValidate(entity: Partial<TEntity>, validationGroups: string[] = []): Promise<ValidationError[]> {
    const validationErrors: ValidationError[] = [];

    validationErrors.concat(await this.entityValidator.tryValidate(entity, validationGroups));
    validationErrors.concat(await this.orgScopedValidator.tryValidate(entity, validationGroups));
    validationErrors.concat(await this.userScopedValidator.tryValidate(entity, validationGroups));

    return validationErrors;
  }
}
