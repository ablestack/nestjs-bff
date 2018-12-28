import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { AuthorizationDomainProviderTokens } from '../authorization.domain.constants';
import { IAuthorizationModel } from '../model/authorization.domain.model';
import { AuthorizationRepoDomainCache } from './authorization.domain.repo-cache';
import { AuthorizationQueryConditions } from './authorization.query-conditions';

@Injectable()
export class AuthorizationDomainRepoWrite extends BaseRepoWrite<AuthorizationEntity, IAuthorizationModel, AuthorizationQueryConditions> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthorizationDomainProviderTokens.Models.Authorization)
    model: Model<IAuthorizationModel>,
    authorizationRepoCache: AuthorizationRepoDomainCache,
  ) {
    super({ loggerService, model, entityRepoCache: authorizationRepoCache });
  }
}
