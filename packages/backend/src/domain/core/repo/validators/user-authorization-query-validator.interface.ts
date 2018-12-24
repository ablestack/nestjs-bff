import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../../shared/exceptions/validation.exception';
import { Messages } from './messages.constants';
import { IRepoValidator, IValidatorOptions } from './repo-validator.interface';

export interface IUserAuthorizationQueryValidatorOptions extends IValidatorOptions {
  skipUserAuthorization: boolean;
  skipOrgAuthorization: boolean;
}
@Injectable()
export class UserAuthorizationQueryValidator implements IRepoValidator<any, IUserAuthorizationQueryValidatorOptions> {
  public async validate(conditions: any, options?: IUserAuthorizationQueryValidatorOptions) {
    const messages: string[] = [];

    if (!options || !options.skipUserAuthorization) {
      if (!conditions.userId) messages.push(Messages.USER_ID_REQUIRED);
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
