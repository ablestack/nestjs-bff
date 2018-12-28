import { CheckOrgAndUserParam } from '@nestjs-bff/backend/lib/domain/authorization/authorizationchecks/check-org-and-user-param.authorizationcheck';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ReminderRepoCache } from '../../../../domain/reminder/repo/reminder.cache-repo';
import { ReminderRepoWrite } from '../../../../domain/reminder/repo/reminder.write-repo';
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
  constructor(
    private readonly reminderRepoCache: ReminderRepoCache,
    private readonly reminderRepoWrite: ReminderRepoWrite,
  ) {}

  @Get()
  @Authorization([new CheckOrgAndUserParam()])
  public async getItems(@Param('orgId') orgId: string, @Param('userId') userId: string): Promise<ReminderEntity[]> {
    return this.reminderRepoCache.find({ userId, orgId });
  }

  @Get(':id')
  @Authorization([new CheckOrgAndUserParam()])
  public async getItem(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    id: string,
  ): Promise<ReminderEntity> {
    return this.reminderRepoCache.findOne({ _id: id, orgId, userId });
  }

  @Post()
  @Authorization([new CheckOrgAndUserParam()])
  public async create(@Body() entity: ReminderEntity) {
    return this.reminderRepoWrite.create(entity);
  }

  @Put()
  @Authorization([new CheckOrgAndUserParam()])
  public async update(@Body() entity: ReminderEntity) {
    return this.reminderRepoWrite.update(entity);
  }

  @Patch()
  @Authorization([new CheckOrgAndUserParam()])
  public async partialUpdate(@Body() entity: Partial<ReminderEntity>) {
    return this.reminderRepoWrite.patch(entity);
  }

  @Delete()
  @Authorization([new CheckOrgAndUserParam()])
  public async delete(@Param('orgId') orgId: string, @Param('userId') userId: string, id: string) {
    return this.reminderRepoWrite.delete({ _id: id, orgId, userId });
  }

  // @Post()
  // @Authorization([new CheckOrgAndUserParam()])
  // public async create() {
  //   // const authorization: AuthorizationEntity = req.authorization;
  //   // tslint:disable-next-line:no-non-null-assertion (will have userId due to Authorization check)
  //   // this.userRemindersService.createMember(authorization.userId!, cmd);
  // }
}
