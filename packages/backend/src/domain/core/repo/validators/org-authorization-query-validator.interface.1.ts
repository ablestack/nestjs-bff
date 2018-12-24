import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../../shared/exceptions/validation.exception';
import { Messages } from './messages.constants';
import { IRepoValidator, IValidatorOptions } from './repo-validator.interface';

export interface IOrgAuthorizationQueryValidatorOptions extends IValidatorOptions {
  skipUserAuthorization: boolean;
  skipOrgAuthorization: boolean;
}
@Injectable()
export class OrgAuthorizationQueryValidator implements IRepoValidator<any, IOrgAuthorizationQueryValidatorOptions> {
  public async validate(conditions: any, options?: IOrgAuthorizationQueryValidatorOptions) {
    const messages: string[] = [];

    if (!options || !options.skipOrgAuthorization) {
      if (!conditions.orgId) messages.push(Messages.ORG_ID_REQUIRED);
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
