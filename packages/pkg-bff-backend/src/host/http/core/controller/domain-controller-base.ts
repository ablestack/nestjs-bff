import { IEntity } from '@nestjs-bff/global/lib/domain/core/entity.interface';
import { Body, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { BaseRepo } from '../../../../domain/core/repo/base.repo';
import { ScopedEntityAuthCheck } from '../../../../shared/authchecks/scoped-entity.authcheck';
import { Authorization } from '../decorators/authorization.decorator';
import { BffRequest } from '../types/bff-request.contract';

/*
  Domain Service Hosted Endpoints are RESTful, with the following best-practice structure

  GET /items - Retrieves a list of items
  GET /items/12 - Retrieves a specific item
  POST /items - Creates a new item
  PUT /items/12 - Updates item #12
  PATCH /items/12 - Partially updates item #12
  DELETE /items/12 - Deletes item #12

*/

export class DomainControllerBase<TEntity extends IEntity> {
  constructor(private readonly entityRepo: BaseRepo<TEntity>) {}

  @Get()
  @Authorization([new ScopedEntityAuthCheck()])
  public async getItems(@Req() req: BffRequest, @Body() body): Promise<TEntity[]> {
    return this.entityRepo.find(body || {}, { accessPermissions: req.accessPermissions });
  }

  @Get(':id')
  @Authorization([new ScopedEntityAuthCheck()])
  public async getItem(@Req() req: BffRequest, @Param('id') id: string): Promise<TEntity> {
    return this.entityRepo.findById(id, { accessPermissions: req.accessPermissions });
  }

  @Post()
  @Authorization([new ScopedEntityAuthCheck()])
  public async create(@Req() req: BffRequest, @Body() entity: TEntity) {
    return this.entityRepo.create(entity, { accessPermissions: req.accessPermissions });
  }

  @Put()
  @Authorization([new ScopedEntityAuthCheck()])
  public async update(@Req() req: BffRequest, @Body() entity: TEntity) {
    return this.entityRepo.update(entity, { accessPermissions: req.accessPermissions });
  }

  @Patch()
  @Authorization([new ScopedEntityAuthCheck()])
  public async partialUpdate(@Req() req: BffRequest, @Body() entity: Partial<TEntity>) {
    return this.entityRepo.patch(entity, { accessPermissions: req.accessPermissions });
  }

  @Delete()
  @Authorization([new ScopedEntityAuthCheck()])
  public async delete(@Req() req: BffRequest, @Param('id') id) {
    return this.entityRepo.delete(id, { accessPermissions: req.accessPermissions });
  }
}
