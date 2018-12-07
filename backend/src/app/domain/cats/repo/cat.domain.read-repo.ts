import { BaseRepoRead } from '@nestjs-bff/backend/domain/core/repo/base.repo-read';
import { LoggerSharedService } from '@nestjs-bff/backend/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CatEntity } from '../../../global/entities/cat.entity';
import { CatProviderTokens } from '../cat.domain.constants';
import { ICatModel } from '../model/cat.domain.model';

@Injectable()
export class CatRepoRead extends BaseRepoRead<CatEntity, ICatModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(CatProviderTokens.Models.Cat) model: Model<ICatModel>,
  ) {
    super({ loggerService, model });
  }
}
