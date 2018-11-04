import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSysService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { AuthorizationDomainProviderTokens } from '../authorization.domain.constants';
import { IAuthorizationModel } from '../model/authorization.domain.model';
import { AuthorizationRepoDomainCache } from './authorization.domain.repo-cache';

@Injectable()
export class AuthorizationDomainRepoWrite extends BaseRepoWrite<
  AuthorizationEntity,
  IAuthorizationModel
> {
  constructor(
    readonly loggerService: LoggerSysService,
    @Inject(AuthorizationDomainProviderTokens.Models.Authorization)
    model: Model<IAuthorizationModel>,
    authorizationRepoCache: AuthorizationRepoDomainCache,
  ) {
    super({ loggerService, model, entityRepoCache: authorizationRepoCache });
  }
}
