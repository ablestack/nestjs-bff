import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BaseQueryConditions } from '../query-conditions/base.query-conditions';

@Injectable()
export class QueryValidatorService {
  constructor(private readonly loggerService: LoggerSharedService) {}

  /**
   *
   *
   * @param {TQueryConditions} queryConditions
   * @param {string[]} [validationGroups=[]]
   * @memberof BaseRepo
   * @description Validates query conditions.  Defaults to all validation groups
   */
  public validateQuery<TQueryConditions extends BaseQueryConditions>(
    queryConditions: Partial<TQueryConditions>,
    validationGroups: string[] = [],
  ) {
    this.loggerService.trace(
      `QueryValidatorService.validateQuery`,
      queryConditions,
    );
    validate(queryConditions, {
      skipMissingProperties: true,
      groups: validationGroups,
    });
  }
}
