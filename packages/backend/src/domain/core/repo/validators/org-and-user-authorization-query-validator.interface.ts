import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../../shared/exceptions/validation.exception';
import { Messages } from './messages.constants';
import { IRepoValidator } from './repo-validator.interface';

export interface IOrgAndUserAuthorizationQueryValidatorOptions {
  skipUserAuthorization: boolean;
  skipOrgAuthorization: boolean;
}
@Injectable()
export class OrgAndUserAuthorizationQueryValidator implements IRepoValidator<any, IOrgAndUserAuthorizationQueryValidatorOptions> {
  public async validate(conditions: any, options?: IOrgAndUserAuthorizationQueryValidatorOptions) {
    const messages: string[] = [];

    if (!options || !options.skipOrgAuthorization) {
      if (!conditions.orgId) messages.push(Messages.ORG_ID_REQUIRED);
    }

    if (!options || !options.skipUserAuthorization) {
      if (!conditions.userId) messages.push(Messages.USER_ID_REQUIRED);
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
