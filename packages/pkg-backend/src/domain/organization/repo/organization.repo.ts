import { OrganizationEntity } from '@nestjs-bff/global/lib/entities/organization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { ClassValidator } from '../../core/validators/class-validator';
import { IOrganizationModel } from '../model/organization.model';
import { OrganizationProviderTokens } from '../organization.constants';

@Injectable()
export class OrganizationRepo extends BaseRepo<OrganizationEntity, IOrganizationModel> {
  constructor(
    readonly loggerService: LoggerSharedService,
    @Inject(OrganizationProviderTokens.Models.Organization) model: Model<IOrganizationModel>,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
  ) {
    super({
      loggerService,
      cacheStore,
      defaultTTL: nestjsBffConfig.caching.entities.organization,
      entityValidator: new ClassValidator(loggerService, OrganizationEntity),
      model,
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: OrganizationEntity): object[] {
    return [{ slug: entity.slug }];
  }
}
