import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { IEntityValidator } from '../../core/repo/validators/repo-validator.interface';
import { IAuthenticationDomainEntity } from '../model/i-authentication.domain.entity';
import { AuthenticationDomainRepoRead } from '../repo/authentication.domain.repo-read';
import { Messages } from './messages.constants';

export interface IAuthenticationCreateValidatorOptions {
  skipUserIdValidation: boolean;
}
@Injectable()
export class AuthenticationCreateValidator implements IEntityValidator<IAuthenticationDomainEntity, IAuthenticationCreateValidatorOptions> {
  constructor(private readonly authenticationRepo: AuthenticationDomainRepoRead) {}

  public async validate(authenticationEntity: IAuthenticationDomainEntity, options?: IAuthenticationCreateValidatorOptions) {
    const messages: string[] = [];

    if (!options || !options.skipUserIdValidation) {
      if (!authenticationEntity.userId) messages.push(Messages.USER_ID_REQUIRED);
    }

    if (authenticationEntity.local) {
      if (await this.authenticationRepo.findByLocalEmail(authenticationEntity.local.email)) {
        messages.push(Messages.EMAIL_IN_USE);
      }
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
