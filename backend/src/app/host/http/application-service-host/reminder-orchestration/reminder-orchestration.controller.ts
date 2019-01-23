import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { BffRequest } from '@nestjs-bff/backend/lib/host/http/core/types/bff-request.contract';
import { UserAccessAuthCheck } from '@nestjs-bff/backend/lib/shared/authchecks/user-access.authcheck';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { SendReminderToArchiveCommand } from '@yourapp/global/lib/application/reminder-orchestration/send-reminder-to-archive.command';
import { ReminderOrchestrationService } from '../../../../application/reminder-orchestration/reminder-orchestration.service';

@Controller('/reminder/:organizationSlug')
export class ReminderOrchestrationController {
  constructor(private readonly reminderOrchestrationService: ReminderOrchestrationService) {}

  @Post(':userId/sendReminderToArchive')
  @Authorization([new UserAccessAuthCheck()])
  public async sendReminderToArchive(@Req() req: BffRequest, @Body() cmd: SendReminderToArchiveCommand) {
    this.reminderOrchestrationService.sendReminderToArchive(cmd, req.accessPermissions);
  }
}
