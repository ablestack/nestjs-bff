import { AlwaysTrue } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/always-true.authorizationtest';
import { CheckUserOwnership } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/check-user-ownership.authorizationtest';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.http.decorator';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ReminderDomainRepoCache } from '../../../../domain/reminder/repo/reminder.domain.cache-repo';
import { ReminderDomainRepoWrite } from '../../../../domain/reminder/repo/reminder.domain.write-repo';
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
  @Authorization([new CheckUserOwnership()])
  public async findAll(userId: string): Promise<ReminderEntity[]> {
    return this.reminderRepoCache.findByUserId(userId);
  }

  @Get(':id')
  @Authorization([new CheckUserOwnership()])
  public async findById(userId: string, id: string): Promise<ReminderEntity> {
    return this.reminderRepoCache.findOneById(id);
  }

  @Post(':userId')
  @Authorization([new AlwaysTrue()])
  public async create(@Req() req, @Body() cmd: CreateReminderCommand) {
    const authorization: AuthorizationEntity = req.authorization;
    // tslint:disable-next-line:no-non-null-assertion (will have userId due to Authorization check)
    this.userRemindersApplicationService.createMember(authorization.userId!, cmd);
  }
}
