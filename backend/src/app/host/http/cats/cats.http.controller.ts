import { AlwaysTrue } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/always-true.authorizationtest';
import { CheckOrganizationRoles } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/check-organization-roles.authtest';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.http.decorator';
import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCatCommand } from '../../../../app/global/commands/create-cat.command';
import { CatEntity } from '../../../../app/global/entities/cat.entity';
import { CatRepoCache } from '../../../domain/cats/repo/cat.domain.cache-repo';
import { CatRepoWrite } from '../../../domain/cats/repo/cat.domain.write-repo';
@Controller('/cats')
export class CatsHttpController {
  constructor(private readonly catRepoWrite: CatRepoWrite, private readonly catRepoCache: CatRepoCache) {}

  @Post()
  public async create(@Body() createCatDto: CreateCatCommand) {
    this.catRepoWrite.create(createCatDto);
  }

  @Get()
  @Authorization([new AlwaysTrue()])
  public async findAll(): Promise<CatEntity[]> {
    return this.catRepoCache.findAll();
  }

  @Get('protected')
  @Authorization([new CheckOrganizationRoles([OrganizationRoles.admin])])
  public async findProtected(): Promise<CatEntity[]> {
    return this.catRepoCache.findAll();
  }

  @Get(':organizationSlug/residents/:id')
  @Authorization([new AlwaysTrue()])
  public findOne(@Param('id') id): Promise<CatEntity | null> {
    return this.catRepoCache.findById(id);
  }
}
