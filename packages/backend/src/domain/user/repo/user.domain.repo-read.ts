import { UserDomainEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from '../../core/repo/base.repo-read';
import { IUserDomainModel } from '../model/user.domain.model';
import { UserProviderTokens } from '../user.domain.constants';

@Injectable()
export class UserDomainRepoRead extends BaseRepoRead<
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
