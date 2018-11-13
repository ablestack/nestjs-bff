import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from '../../core/repo/base.repo-read';
import { AuthorizationDomainProviderTokens } from '../authorization.domain.constants';
import { IAuthorizationModel } from '../model/authorization.domain.model';

@Injectable()
export class AuthorizationDomainRepoRead extends BaseRepoRead<
  AuthorizationEntity,
  IAuthorizationModel
> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(AuthorizationDomainProviderTokens.Models.Authorization)
    model: Model<IAuthorizationModel>,
  ) {
    super({ loggerService, model });
  }

  public async findByUserId(
    userId: string,
  ): Promise<AuthorizationEntity | null> {
    return this.model.findOne({ userId });
  }
}
