import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSysService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { AuthenticationDomainProviderTokens } from '../authentication.domain.constants';
import { IAuthenticationDomainModel } from '../model/authentication.domain.model';
import { IAuthenticationDomainEntity } from '../model/i-authentication.domain.entity';
import { AuthenticationCreateValidator } from '../validators/authentication-create.validator';

@Injectable()
export class AuthenticationDomainRepoWrite extends BaseRepoWrite<
  IAuthenticationDomainEntity,
  IAuthenticationDomainModel
> {
  constructor(
    loggerService: LoggerSysService,
    @Inject(AuthenticationDomainProviderTokens.Models.Authentication)
    model: Model<IAuthenticationDomainModel>,
    createValidator: AuthenticationCreateValidator,
  ) {
    super({ loggerService, model, createValidator });
  }
}
