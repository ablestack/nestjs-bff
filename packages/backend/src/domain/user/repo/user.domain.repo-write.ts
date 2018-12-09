import { UserDomainEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoWrite } from '../../core/repo/base.repo-write';
import { IUserDomainModel } from '../model/user.domain.model';
import { UserProviderTokens } from '../user.domain.constants';

@Injectable()
export class UserDomainRepoWrite extends BaseRepoWrite<
  UserDomainEntity,
  IUserDomainModel
> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(UserProviderTokens.Models.User) model: Model<IUserDomainModel>,
  ) {
    super({ loggerService, model });
  }
}
