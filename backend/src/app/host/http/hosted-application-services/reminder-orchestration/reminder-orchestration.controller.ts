import { UserAuthCheck } from '@nestjs-bff/backend/lib/shared/authchecks/user.authcheck';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { BffRequest } from '@nestjs-bff/backend/lib/host/http/core/types/bff-request.contract';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReminderOrchestrationService } from '../../../../application/reminder-orchestration/reminder-orchestration.service';
import { SendReminderToArchiveCommand } from '../../../../global/commands/send-reminder-to-archive.command';

@Controller('/reminder/:organizationSlug')
export class ReminderOrchestrationController {
  constructor(private readonly reminderOrchestrationService: ReminderOrchestrationService) {}

  @Post(':userId/sendReminderToArchive')
  @Authorization([new UserAuthCheck()])
  public async sendReminderToArchive(@Req() req: BffRequest, @Body() cmd: SendReminderToArchiveCommand) {
    this.reminderOrchestrationService.sendReminderToArchive(cmd, req.accessPermissions);
  }
}
