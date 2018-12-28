import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { AuthenticationDomainProviderTokens } from '../authentication.domain.constants';
import { AuthenticationDomainEntity } from '../model/authentication.domain.entity';
import { IAuthenticationDomainModel } from '../model/authentication.domain.model';
import { AuthenticationQueryConditions } from './authentication.query-conditions';

@Injectable()
export class AuthenticationDomainRepoWrite extends BaseRepoWrite<
  AuthenticationDomainEntity,
  IAuthenticationDomainModel,
  AuthenticationQueryConditions
> {
  constructor(
    loggerService: LoggerSharedService,
    @Inject(AuthenticationDomainProviderTokens.Models.Authentication)
    model: Model<IAuthenticationDomainModel>,
  ) {
    super({ loggerService, model });
  }
}
