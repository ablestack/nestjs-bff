import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { BffRequest } from '@nestjs-bff/backend/lib/host/http/core/types/bff-request.contract';
import { OrgAccessAuthCheck } from '@nestjs-bff/backend/lib/shared/authchecks/org-access.authcheck';
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
  constructor(private readonly reminderRepo: ReminderRepo) {}

  @Get()
  @Authorization([new OrgAccessAuthCheck()])
  public async getItems(@Req() req: BffRequest, string, @Body() entity: ReminderEntity): Promise<ReminderEntity[]> {
    return this.reminderRepo.find(entity, { accessPermissions: req.accessPermissions });
  }

  @Get(':id')
  @Authorization([new OrgAccessAuthCheck()])
  public async getItem(@Req() req: BffRequest, @Param('id') _id: string, id: string): Promise<ReminderEntity> {
    return this.reminderRepo.findOne({ _id }, { accessPermissions: req.accessPermissions });
  }

  @Post()
  @Authorization([new OrgAccessAuthCheck()])
  public async create(@Req() req: BffRequest, @Body() entity: ReminderEntity) {
    return this.reminderRepo.create(entity, { accessPermissions: req.accessPermissions });
  }

  @Put()
  @Authorization([new OrgAccessAuthCheck()])
  public async update(@Req() req: BffRequest, @Body() entity: ReminderEntity) {
    return this.reminderRepo.update(entity, { accessPermissions: req.accessPermissions });
  }

  @Patch()
  @Authorization([new OrgAccessAuthCheck()])
  public async partialUpdate(@Req() req: BffRequest, @Body() entity: Partial<ReminderEntity>) {
    return this.reminderRepo.patch(entity, { accessPermissions: req.accessPermissions });
  }

  @Delete()
  @Authorization([new OrgAccessAuthCheck()])
  public async delete(@Req() req: BffRequest, @Param('id') id) {
    return this.reminderRepo.delete(id, { accessPermissions: req.accessPermissions });
  }
}
