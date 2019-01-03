import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import _ = require('lodash');
import { AppError } from '../../../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BaseQueryConditions } from '../query-conditions/base.query-conditions';

@Injectable()
export class QueryValidatorService<TQueryConditions extends BaseQueryConditions> {
  constructor(private readonly loggerService: LoggerSharedService, private readonly queryConditionsType: { new (): TQueryConditions }) {}

  /**
   *
   *
   * @param {TQueryConditions} queryConditions
   * @param {string[]} [validationGroups=[]]
   * @memberof BaseRepo
   * @description Validates query conditions.  Defaults to all validation groups
   */
  public async validateQuery(queryConditions: Partial<TQueryConditions>, validationGroups: string[] = []) {
    this.loggerService.trace(`QueryValidatorService.validateQuery`, queryConditions);

    // ensure the object has the relevant attributes
    const qcInstance: TQueryConditions = new this.queryConditionsType();
    _.merge(qcInstance, queryConditions);

    this.loggerService.debug(`validateQuery`, { queryConditions, qcInstance });

    const validationErrors = await validate(qcInstance, {
      skipMissingProperties: true,
      groups: validationGroups,
    });

    if (validationErrors && validationErrors.length > 0) {
      throw new AppError(`Validation Failed`, { queryConditions, errors: validationErrors });
    }
  }
}
