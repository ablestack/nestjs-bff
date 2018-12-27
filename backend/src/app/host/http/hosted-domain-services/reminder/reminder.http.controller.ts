import { CheckOrgAndUserParam } from '@nestjs-bff/backend/lib/domain/authorization/authorizationchecks/check-org-and-user-param.authorizationcheck';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.http.decorator';
import { Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ReminderDomainRepoCache } from '../../../../domain/reminder/repo/reminder.cache-repo';
import { ReminderDomainRepoWrite } from '../../../../domain/reminder/repo/reminder.write-repo';
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
export class ReminderHttpController {
  constructor(
    private readonly reminderRepoCache: ReminderDomainRepoCache,
    private readonly reminderRepoWrite: ReminderDomainRepoWrite,
  ) {}

  @Get()
  @Authorization([new CheckOrgAndUserParam()])
  public async getItems(userId: string): Promise<ReminderEntity[]> {
    return this.reminderRepoCache.findByUserId(userId);
  }

  @Get(':id')
  @Authorization([new CheckOrgAndUserParam()])
  public async getItem(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    id: string,
  ): Promise<ReminderEntity> {
    return this.reminderRepoCache.findOneById(id, { orgId, userId });
  }

  @Post()
  @Authorization([new CheckOrgAndUserParam()])
  public async create() {}

  @Put()
  @Authorization([new CheckOrgAndUserParam()])
  public async update() {}

  @Patch()
  @Authorization([new CheckOrgAndUserParam()])
  public async partialUpdate() {}

  @Delete()
  @Authorization([new CheckOrgAndUserParam()])
  public async delete() {}

  // @Post()
  // @Authorization([new CheckOrgAndUserParam()])
  // public async create() {
  //   // const authorization: AuthorizationEntity = req.authorization;
  //   // tslint:disable-next-line:no-non-null-assertion (will have userId due to Authorization check)
  //   // this.userRemindersApplicationService.createMember(authorization.userId!, cmd);
  // }
}
