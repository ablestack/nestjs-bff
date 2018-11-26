import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { AuthenticationDomainProviderTokens } from '../authentication.domain.constants';
import { IAuthenticationDomainEntity } from '../model/authentication.domain.entity';
import { IAuthenticationDomainModel } from '../model/authentication.domain.model';
import { AuthenticationCreateValidator } from '../validators/authentication-create.validator';

@Injectable()
export class AuthenticationDomainRepoWrite extends BaseRepoWrite<
  IAuthenticationDomainEntity,
  IAuthenticationDomainModel
> {
  constructor(
    loggerService: LoggerSharedService,
    @Inject(AuthenticationDomainProviderTokens.Models.Authentication)
    model: Model<IAuthenticationDomainModel>,
    createValidator: AuthenticationCreateValidator,
  ) {
    super({ loggerService, model, createValidator });
  }
}
