import { OrganizationEntity } from '@nestjs-bff/universal/entities/organization.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoggerSysService } from '../../../shared/logging/logger.shared.service';
import { BaseRepoRead } from '../../core/repo/base.repo-read';
import { IOrganizationDomainModel } from '../model/organization.domain.model';
import { OrganizationProviderTokens } from '../organization.domain.constants';

@Injectable()
export class OrganizationDomainRepoRead extends BaseRepoRead<
  OrganizationEntity,
  IOrganizationDomainModel
> {
  constructor(
    readonly loggerService: LoggerSysService,
    @Inject(OrganizationProviderTokens.Models.Organization)
    model: Model<IOrganizationDomainModel>,
  ) {
    super({ loggerService, model });
  }

  public async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    return this.model.findOne({ slug });
  }
}
