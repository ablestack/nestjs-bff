import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from '../../core/repo/base.repo-read';
import { AuthorizationDomainProviderTokens } from '../authorization.domain.constants';
import { IAuthorizationModel } from '../model/authorization.domain.model';
import { AuthorizationQueryConditions } from './authorization.query-conditions';

@Injectable()
export class AuthorizationDomainRepoRead extends BaseRepoRead<AuthorizationEntity, IAuthorizationModel, AuthorizationQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthorizationDomainProviderTokens.Models.Authorization)
    model: Model<IAuthorizationModel>,
  ) {
    super({ loggerService, model });
  }
}
