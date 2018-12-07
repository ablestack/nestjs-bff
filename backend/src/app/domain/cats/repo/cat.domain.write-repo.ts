import { BaseRepoWrite } from '@nestjs-bff/backend/domain/core/repo/base.repo-write';
import { LoggerSharedService } from '@nestjs-bff/backend/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CatEntity } from '../../../global/entities/cat.entity';
import { CatProviderTokens } from '../cat.domain.constants';
import { ICatModel } from '../model/cat.domain.model';
import { CatRepoCache } from './cat.domain.cache-repo';

@Injectable()
export class CatRepoWrite extends BaseRepoWrite<CatEntity, ICatModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(CatProviderTokens.Models.Cat) model: Model<ICatModel>,
    catRepoCache: CatRepoCache,
  ) {
    super({ loggerService, model, entityRepoCache: catRepoCache });
  }
}
