import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { BffRequest } from '@nestjs-bff/backend/lib/host/http/core/types/bff-request.contract';
import { OrgAndUserAccessAuthCheck } from '@nestjs-bff/backend/lib/shared/authchecks/org-and-user-access.authcheck';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ReminderRepo } from '../../../../domain/reminder/repo/reminder.repo';
import { ReminderEntity } from '../../../../global/entities/reminder.entity';

/*
  Domain Service Hosted Endpoints are RESTful, with the following best-practice structure

  GET /items - Retrieves a list of items
  GET /items/12 - Retrieves a specific item
  POST /items - Creates a new item
  PUT /items/12 - Updates item #12
  PATCH /items/12 - Partially updates item #12
  DELETE /items/12 - Deletes item #12

*/

@Controller('/reminder/:organizationSlug/:userId')
export class ReminderController {
  constructor(private readonly entityRepo: ReminderRepo) {}

  @Get()
  @Authorization([new OrgAndUserAccessAuthCheck()])
  public async getItems(@Req() req: BffRequest, @Param('userId') userId): Promise<ReminderEntity[]> {
    return this.entityRepo.find({ userId }, { accessPermissions: req.accessPermissions });
  }

  @Get(':id')
  @Authorization([new OrgAndUserAccessAuthCheck()])
  public async getItem(@Req() req: BffRequest, @Param('id') _id: string, id: string): Promise<ReminderEntity> {
    return this.entityRepo.findOne({ _id }, { accessPermissions: req.accessPermissions });
  }

  @Post()
  @Authorization([new OrgAndUserAccessAuthCheck()])
  public async create(@Req() req: BffRequest, @Body() entity: ReminderEntity) {
    return this.entityRepo.create(entity, { accessPermissions: req.accessPermissions });
  }

  @Put()
  @Authorization([new OrgAndUserAccessAuthCheck()])
  public async update(@Req() req: BffRequest, @Body() entity: ReminderEntity) {
    return this.entityRepo.update(entity, { accessPermissions: req.accessPermissions });
  }

  @Patch()
  @Authorization([new OrgAndUserAccessAuthCheck()])
  public async partialUpdate(@Req() req: BffRequest, @Body() entity: Partial<ReminderEntity>) {
    return this.entityRepo.patch(entity, { accessPermissions: req.accessPermissions });
  }

  @Delete()
  @Authorization([new OrgAndUserAccessAuthCheck()])
  public async delete(@Req() req: BffRequest, @Param('id') id) {
    return this.entityRepo.delete(id, { accessPermissions: req.accessPermissions });
  }
}
