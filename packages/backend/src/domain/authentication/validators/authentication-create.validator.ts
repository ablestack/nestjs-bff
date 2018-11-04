import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { IValidator } from '../../core/repo/validator.interface';
import { IAuthenticationDomainEntity } from '../model/i-authentication.domain.entity';
import { AuthenticationDomainRepoRead } from '../repo/authentication.domain.repo-read';
import { AuthenticationValidatorMessages } from './messages.constants';

export interface IAuthenticationCreateValidatorOptions {
  skipUserIdValidation: boolean;
}
@Injectable()
export class AuthenticationCreateValidator
  implements
    IValidator<
      IAuthenticationDomainEntity,
      IAuthenticationCreateValidatorOptions
    > {
  constructor(
    private readonly authenticationRepo: AuthenticationDomainRepoRead,
  ) {}

  public async validate(
    authenticationEntity: IAuthenticationDomainEntity,
    options?: IAuthenticationCreateValidatorOptions,
  ) {
    const messages: string[] = [];

    if (!options || !options.skipUserIdValidation) {
      if (!authenticationEntity.userId)
        messages.push(AuthenticationValidatorMessages.USER_ID_REQUIRED);
    }

    if (authenticationEntity.local) {
      if (
        await this.authenticationRepo.findByLocalEmail(
          authenticationEntity.local.email,
        )
      ) {
        messages.push(AuthenticationValidatorMessages.EMAIL_IN_USE);
      }
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
